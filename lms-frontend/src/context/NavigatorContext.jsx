import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { capabilityGraphs } from '../data/capabilityGraphs';
import { generatePath, replanPath } from '../engine/pathOptimizer';
import { getResourcesForSkill } from '../data/resources';
import { getNavigatorState, saveNavigatorState } from '../services/navigatorService';

const NavigatorContext = createContext();

export const useNavigator = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
};

// ─── Initial empty state shape ───────────────────────────────────────────────
const EMPTY_STATE = { paths: [], activePathId: null };
const STORAGE_KEY = 'lms_navigator_cache';

export const NavigatorProvider = ({ children }) => {
  // Load from local storage initially (instant)
  const getInitialState = () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached navigator state');
    }
    return EMPTY_STATE;
  };

  const [state, setState] = useState(getInitialState);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const saveTimerRef = useRef(null);

  // ─── Debounced save to backend on every state change ───────────────────────
  const scheduleBackendSave = useCallback((newState) => {
    // Instantly save to local cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveNavigatorState(newState);
        setLastSyncedAt(new Date());
      } catch (err) {
        console.warn('[Navigator] Failed to sync state to backend:', err.message);
      }
    }, 1500);
  }, []);

  // ─── Load state from backend on mount ──────────────────────────────────────
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        setIsSyncing(true);
        const response = await getNavigatorState();

        if (response?.stateJson) {
          const parsed = JSON.parse(response.stateJson);
          
          // Protection: Don't let an empty backend wipe out a populated local cache
          const isBackendEmpty = !parsed.paths || parsed.paths.length === 0;
          const cached = localStorage.getItem(STORAGE_KEY);
          const localHasData = cached && JSON.parse(cached).paths?.length > 0;
          
          if (isBackendEmpty && localHasData) {
            console.log('[Navigator] Backend is empty but local cache has data. Pushing cache to backend.');
            // Push our local data to the backend to recover it
            scheduleBackendSave(JSON.parse(cached));
            return;
          }

          let finalState = parsed;

          // Migration: handle old single-path format
          if (parsed.goal && !parsed.paths) {
            const legacyPath = {
              id: 'path_' + Date.now(),
              createdAt: new Date().toISOString(),
              status: 'active',
              goal: parsed.goal,
              capabilityGraph: parsed.capabilityGraph,
              learnerState: parsed.learnerState || {},
              currentPath: parsed.currentPath || [],
              pathStatus: parsed.pathStatus || 'planning',
              recoveryHistory: parsed.recoveryHistory || [],
              chatHistory: parsed.chatHistory || [],
              canvasEdits: parsed.canvasEdits || [],
              milestones: [],
              notes: {},
              learningDates: [],
              totalTimeMinutes: 0,
              lastActiveAt: new Date().toISOString()
            };
            finalState = { paths: [legacyPath], activePathId: legacyPath.id };
          }
          
          setState(finalState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
          setLastSyncedAt(new Date());
        }
      } catch (err) {
        console.warn('[Navigator] Could not load state from backend, using cache:', err.message);
      } finally {
        setIsSyncing(false);
      }
    };

    loadFromBackend();
  }, [scheduleBackendSave]);

  // ─── Dispatch function ─────────────────────────────────────────────────────
  const dispatch = useCallback((action) => {
    setState((prevState) => {
      const newPaths = prevState.paths.map(p => ({ ...p }));
      let newActivePathId = prevState.activePathId;

      const activeIdx = newPaths.findIndex(p => p.id === newActivePathId);
      const activePath = activeIdx >= 0 ? newPaths[activeIdx] : null;

      if (activePath) {
        activePath.lastActiveAt = new Date().toISOString();
      }

      switch (action.type) {

        // ── Global multi-path actions ──────────────────────────────────────
        case 'SET_GOAL': {
          const goal = action.payload;

          // If path for this role already exists and forceNew is not set → just switch to it
          const existingIdx = newPaths.findIndex(
            p => p.goal?.targetRole === goal.targetRole && p.status !== 'archived'
          );
          if (existingIdx >= 0 && !goal.forceNew) {
            newActivePathId = newPaths[existingIdx].id;
            break;
          }

          // Build initial learner state from known skills
          const newLearnerState = {};
          if (goal.knownSkills) {
            goal.knownSkills.forEach(skill => {
              newLearnerState[skill] = {
                skillId: skill,
                masteryScore: 100,
                evidenceLevel: 'strong',
                status: 'verified'
              };
            });
          }

          const capabilityGraph = capabilityGraphs[goal.targetRole];
          const newPath = {
            id: 'path_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'active',
            goal,
            capabilityGraph,
            learnerState: newLearnerState,
            currentPath: capabilityGraph
              ? generatePath(goal, newLearnerState, capabilityGraph)
              : [],
            pathStatus: 'planning',
            recoveryHistory: [],
            chatHistory: [],
            canvasEdits: [],
            milestones: [],
            notes: {},
            learningDates: [],
            totalTimeMinutes: 0,
            lastActiveAt: new Date().toISOString()
          };

          newPaths.push(newPath);
          newActivePathId = newPath.id;
          break;
        }

        case 'SWITCH_PATH':
          newActivePathId = action.payload;
          break;

        case 'PAUSE_PATH': {
          const idx = newPaths.findIndex(p => p.id === action.payload);
          if (idx >= 0) newPaths[idx].status = 'paused';
          break;
        }

        case 'RESUME_PATH': {
          const idx = newPaths.findIndex(p => p.id === action.payload);
          if (idx >= 0) {
            newPaths[idx].status = 'active';
            newActivePathId = action.payload;
          }
          break;
        }

        case 'ARCHIVE_PATH': {
          const idx = newPaths.findIndex(p => p.id === action.payload);
          if (idx >= 0) newPaths[idx].status = 'archived';
          break;
        }

        case 'DELETE_PATH': {
          const filtered = newPaths.filter(p => p.id !== action.payload);
          if (newActivePathId === action.payload) {
            newActivePathId = filtered.find(p => p.status !== 'archived')?.id || null;
          }
          const nextState = { paths: filtered, activePathId: newActivePathId };
          scheduleBackendSave(nextState);
          return nextState;
        }

        case 'MARK_PATH_COMPLETE': {
          const idx = newPaths.findIndex(p => p.id === action.payload);
          if (idx >= 0) newPaths[idx].status = 'completed';
          break;
        }

        case 'CLEAR_STATE': {
          const cleared = EMPTY_STATE;
          scheduleBackendSave(cleared);
          return cleared;
        }

        // ── Active-path actions ────────────────────────────────────────────
        default:
          if (!activePath) return prevState;

          switch (action.type) {

            case 'ADD_CHAT_MESSAGE':
              activePath.chatHistory = [...activePath.chatHistory, action.payload];
              break;

            case 'SET_PATH_STATUS':
              activePath.pathStatus = action.payload;
              break;

            case 'REPLAN_PATH':
              if (activePath.capabilityGraph && activePath.currentPath.length > 0) {
                activePath.currentPath = replanPath(
                  activePath.currentPath,
                  activePath.learnerState,
                  activePath.capabilityGraph
                );
              }
              break;

            case 'UPDATE_CONSTRAINT': {
              if (activePath.goal) {
                activePath.goal = { ...activePath.goal, [action.payload.field]: action.payload.value };
                if (
                  action.payload.field === 'deadline' ||
                  action.payload.field === 'availableHoursPerWeek'
                ) {
                  const wks = parseInt(activePath.goal.deadline) || 12;
                  activePath.goal.totalBudgetHours = wks * (activePath.goal.availableHoursPerWeek || 10);
                }
                if (activePath.capabilityGraph && activePath.currentPath.length > 0) {
                  activePath.currentPath = replanPath(
                    activePath.currentPath,
                    activePath.learnerState,
                    activePath.capabilityGraph
                  );
                }
              }
              break;
            }

            case 'ADD_SKILL_TO_PATH': {
              const rawSkillId = action.payload;
              const nodes = activePath.capabilityGraph?.nodes || {};
              let resolvedId = nodes[rawSkillId] ? rawSkillId : null;

              if (!resolvedId) {
                const normalizedRaw = rawSkillId.toLowerCase().replace(/[^a-z0-9]/g, '');
                resolvedId = Object.keys(nodes).find(nodeId => {
                  const normalizedNode = nodeId.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const normalizedLabel = (nodes[nodeId].label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                  return (
                    normalizedNode.includes(normalizedRaw) ||
                    normalizedRaw.includes(normalizedNode) ||
                    normalizedLabel.includes(normalizedRaw) ||
                    normalizedRaw.includes(normalizedLabel)
                  );
                }) || null;
              }

              if (resolvedId) {
                if (!activePath.currentPath.find(n => n.skillId === resolvedId)) {
                  activePath.currentPath = [
                    ...activePath.currentPath,
                    {
                      skillId: resolvedId,
                      order: activePath.currentPath.length,
                      status: 'upcoming',
                      estimatedHours: nodes[resolvedId]?.estimatedHours || 3,
                      selectedResource: null,
                      isUserAdded: true,
                      isRecovery: false,
                      nodeRef: nodes[resolvedId]
                    }
                  ];
                }
              } else {
                const customId = rawSkillId.toLowerCase().replace(/\s+/g, '_');
                const humanLabel = rawSkillId.replace(/_/g, ' ');
                if (!activePath.currentPath.find(n => n.skillId === customId)) {
                  activePath.capabilityGraph = {
                    ...activePath.capabilityGraph,
                    nodes: {
                      ...activePath.capabilityGraph.nodes,
                      [customId]: {
                        id: customId,
                        label: humanLabel,
                        category: 'Custom',
                        prerequisites: [],
                        unlocks: [],
                        masteryThreshold: 60,
                        goalRelevance: 0.7,
                        dependencyImpact: 0.5
                      }
                    }
                  };
                  activePath.currentPath = [
                    ...activePath.currentPath,
                    {
                      skillId: customId,
                      order: activePath.currentPath.length,
                      status: 'upcoming',
                      estimatedHours: 3,
                      selectedResource: null,
                      isUserAdded: true,
                      isRecovery: false,
                      nodeRef: activePath.capabilityGraph.nodes[customId]
                    }
                  ];
                }
              }
              break;
            }

            case 'REMOVE_SKILL_FROM_PATH':
              activePath.currentPath = activePath.currentPath.filter(n => n.skillId !== action.payload);
              break;

            case 'UPDATE_MASTERY': {
              const { skillId, masteryScore } = action.payload;
              activePath.learnerState = {
                ...activePath.learnerState,
                [skillId]: {
                  ...activePath.learnerState[skillId],
                  skillId,
                  masteryScore,
                  evidenceLevel: 'strong',
                  status:
                    masteryScore >= (activePath.capabilityGraph?.nodes?.[skillId]?.masteryThreshold || 60)
                      ? 'verified'
                      : 'gap'
                }
              };
              // Track learning date for the heatmap calendar
              const today = new Date().toISOString().split('T')[0];
              if (!activePath.learningDates) activePath.learningDates = [];
              if (!activePath.learningDates.includes(today)) {
                activePath.learningDates.push(today);
              }
              break;
            }

            case 'ADD_SUBTREE_TO_PATH': {
              const { nodes: newNodes } = action.payload;
              if (!newNodes || newNodes.length === 0) break;

              const newNodeIds = new Set(newNodes.map(n => n.id));
              const updatedGraphNodes = { ...activePath.capabilityGraph.nodes };

              newNodes.forEach(n => {
                updatedGraphNodes[n.id] = {
                  id: n.id,
                  label: n.label,
                  category: n.category || 'Custom',
                  prerequisites: n.prerequisites || [],
                  unlocks: n.unlocks || [],
                  masteryThreshold: 60,
                  goalRelevance: 0.75,
                  dependencyImpact: 0.5,
                  isUserAdded: true
                };
              });

              newNodes.forEach(n => {
                const externalPrereqs = (n.prerequisites || []).filter(
                  pId => !newNodeIds.has(pId) && updatedGraphNodes[pId]
                );
                externalPrereqs.forEach(pId => {
                  const parent = updatedGraphNodes[pId];
                  if (parent && !parent.unlocks.includes(n.id)) {
                    updatedGraphNodes[pId] = { ...parent, unlocks: [...parent.unlocks, n.id] };
                  }
                });
              });

              activePath.capabilityGraph = { ...activePath.capabilityGraph, nodes: updatedGraphNodes };

              const inPath = new Set(activePath.currentPath.map(p => p.skillId));
              const sorted = [...newNodes].sort((a, b) => {
                const aHasNewDeps = (a.prerequisites || []).some(pId => newNodeIds.has(pId));
                const bHasNewDeps = (b.prerequisites || []).some(pId => newNodeIds.has(pId));
                return aHasNewDeps === bHasNewDeps ? 0 : aHasNewDeps ? 1 : -1;
              });

              const additions = sorted
                .filter(n => !inPath.has(n.id))
                .map((n, idx) => ({
                  skillId: n.id,
                  order: activePath.currentPath.length + idx,
                  status: 'upcoming',
                  estimatedHours: n.estimatedHours || 3,
                  selectedResource: null,
                  isUserAdded: true,
                  isRecovery: false,
                  nodeRef: updatedGraphNodes[n.id]
                }));

              activePath.currentPath = [...activePath.currentPath, ...additions];
              break;
            }

            case 'CONFIGURE_SKILL_IN_PATH': {
              const { skillId: cfgId, estimatedHours } = action.payload;
              activePath.currentPath = activePath.currentPath.map(item =>
                item.skillId === cfgId
                  ? { ...item, estimatedHours: estimatedHours ?? item.estimatedHours }
                  : item
              );
              break;
            }

            case 'SET_CONTENT_MODE': {
              if (activePath.goal) {
                activePath.goal = { ...activePath.goal, contentMode: action.payload };
                activePath.currentPath = activePath.currentPath.map(item => {
                  const resources = getResourcesForSkill(item.skillId, action.payload);
                  if (resources && resources.length > 0) {
                    const selectedResource =
                      resources.find(r => r.learningStyle === activePath.goal.learningPreference) ||
                      resources[0];
                    return {
                      ...item,
                      selectedResource,
                      estimatedHours: selectedResource.durationMinutes / 60
                    };
                  }
                  return item;
                });
              }
              break;
            }

            case 'TRIGGER_RECOVERY':
              activePath.pathStatus = 'blocked';
              break;

            case 'ADD_MILESTONE':
              activePath.milestones = [...(activePath.milestones || []), action.payload];
              break;

            case 'TOGGLE_MILESTONE':
              activePath.milestones = (activePath.milestones || []).map(m =>
                m.id === action.payload ? { ...m, isCompleted: !m.isCompleted } : m
              );
              break;

            case 'ADD_SKILL_NOTE': {
              const { skillId, note } = action.payload;
              activePath.notes = { ...(activePath.notes || {}), [skillId]: note };
              break;
            }

            case 'ACCUMULATE_TIME':
              activePath.totalTimeMinutes = (activePath.totalTimeMinutes || 0) + action.payload;
              break;

            default:
              break;
          }
      }

      const nextState = { paths: newPaths, activePathId: newActivePathId };
      scheduleBackendSave(nextState);
      return nextState;
    });
  }, [scheduleBackendSave]);

  // ─── Expose activePath fields at root level for backwards compatibility ────
  const activePath = state.paths.find(p => p.id === state.activePathId) || {};

  const exposedState = {
    // Active path fields (backwards-compatible)
    goal: activePath.goal || null,
    capabilityGraph: activePath.capabilityGraph || null,
    learnerState: activePath.learnerState || {},
    currentPath: activePath.currentPath || [],
    pathStatus: activePath.pathStatus || 'planning',
    recoveryHistory: activePath.recoveryHistory || [],
    chatHistory: activePath.chatHistory || [],
    canvasEdits: activePath.canvasEdits || [],
    milestones: activePath.milestones || [],
    notes: activePath.notes || {},
    learningDates: activePath.learningDates || [],
    totalTimeMinutes: activePath.totalTimeMinutes || 0,
    // Multi-path fields
    paths: state.paths,
    activePathId: state.activePathId,
    // Sync metadata
    isSyncing,
    lastSyncedAt
  };

  return (
    <NavigatorContext.Provider value={{ state: exposedState, dispatch }}>
      {children}
    </NavigatorContext.Provider>
  );
};
