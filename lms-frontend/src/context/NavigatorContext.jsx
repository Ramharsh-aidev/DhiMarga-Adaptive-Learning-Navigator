import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

import { capabilityGraphs } from '../data/capabilityGraphs';
import { generatePath, replanPath } from '../engine/pathOptimizer';
import { getResourcesForSkill } from '../data/resources';

const NavigatorContext = createContext();

export const useNavigator = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
};

export const NavigatorProvider = ({ children }) => {
  const [state, setState] = useState({
    paths: [],
    activePathId: null
  });

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATOR);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migration logic: if old flat format, convert to multi-path format
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
            totalTimeMinutes: 0,
            lastActiveAt: new Date().toISOString()
          };
          setState({ paths: [legacyPath], activePathId: legacyPath.id });
        } else {
          setState(parsed);
        }
      } catch (e) {
        console.error('Failed to parse navigator state', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NAVIGATOR, JSON.stringify(state));
  }, [state]);

  const dispatch = (action) => {
    setState((prevState) => {
      // Deep copy paths array so we don't mutate state directly
      const newPaths = prevState.paths.map(p => ({ ...p }));
      let newActivePathId = prevState.activePathId;
      
      const activeIdx = newPaths.findIndex(p => p.id === newActivePathId);
      const activePath = activeIdx >= 0 ? newPaths[activeIdx] : null;

      if (activePath) {
        activePath.lastActiveAt = new Date().toISOString();
      }

      switch (action.type) {
        // ---- Global Multi-Path Actions ----
        case 'SET_GOAL': {
          const goal = action.payload;
          
          // Check if path already exists for this goal role
          const existingIdx = newPaths.findIndex(p => p.goal?.targetRole === goal.targetRole && p.status !== 'archived');
          if (existingIdx >= 0 && !action.payload.forceNew) {
             // We just switch to it (unless forceNew is set)
             newActivePathId = newPaths[existingIdx].id;
             break;
          }

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
            currentPath: capabilityGraph ? generatePath(goal, newLearnerState, capabilityGraph) : [],
            pathStatus: 'planning',
            recoveryHistory: [],
            chatHistory: [],
            canvasEdits: [],
            milestones: [],
            notes: {},
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
             newActivePathId = filtered.length > 0 ? filtered[0].id : null;
          }
          return { paths: filtered, activePathId: newActivePathId };
        }

        case 'MARK_PATH_COMPLETE': {
          const idx = newPaths.findIndex(p => p.id === action.payload);
          if (idx >= 0) newPaths[idx].status = 'completed';
          break;
        }
        
        case 'CLEAR_STATE':
          return { paths: [], activePathId: null };

        // ---- Active Path Actions ----
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
                activePath.currentPath = replanPath(activePath.currentPath, activePath.learnerState, activePath.capabilityGraph);
              }
              break;

            case 'UPDATE_CONSTRAINT': {
              if (activePath.goal) {
                activePath.goal = { ...activePath.goal, [action.payload.field]: action.payload.value };
                if (action.payload.field === 'deadline' || action.payload.field === 'availableHoursPerWeek') {
                   const wks = parseInt(activePath.goal.deadline) || 12;
                   activePath.goal.totalBudgetHours = wks * (activePath.goal.availableHoursPerWeek || 10);
                }
                if (activePath.capabilityGraph && activePath.currentPath.length > 0) {
                  activePath.currentPath = replanPath(activePath.currentPath, activePath.learnerState, activePath.capabilityGraph);
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
                  return normalizedNode.includes(normalizedRaw)
                    || normalizedRaw.includes(normalizedNode)
                    || normalizedLabel.includes(normalizedRaw)
                    || normalizedRaw.includes(normalizedLabel);
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

            case 'REMOVE_SKILL_FROM_PATH': {
              activePath.currentPath = activePath.currentPath.filter(n => n.skillId !== action.payload);
              break;
            }
            
            case 'UPDATE_MASTERY': {
              const { skillId, masteryScore } = action.payload;
              activePath.learnerState = {
                ...activePath.learnerState,
                [skillId]: {
                  ...activePath.learnerState[skillId],
                  skillId,
                  masteryScore,
                  evidenceLevel: 'strong',
                  status: masteryScore >= (activePath.capabilityGraph?.nodes?.[skillId]?.masteryThreshold || 60) ? 'verified' : 'gap'
                }
              };
              
              // Feature: Learning Calendar Tracking
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
                  isUserAdded: true,
                };
              });

              newNodes.forEach(n => {
                const externalPrereqs = (n.prerequisites || []).filter(pId => !newNodeIds.has(pId) && updatedGraphNodes[pId]);
                externalPrereqs.forEach(pId => {
                  const parent = updatedGraphNodes[pId];
                  if (parent && !parent.unlocks.includes(n.id)) {
                    updatedGraphNodes[pId] = {
                      ...parent,
                      unlocks: [...parent.unlocks, n.id]
                    };
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
                  nodeRef: updatedGraphNodes[n.id],
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
                    const selectedResource = resources.find(r => r.learningStyle === activePath.goal.learningPreference) || resources[0];
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
               
            case 'TOGGLE_MILESTONE': {
               activePath.milestones = (activePath.milestones || []).map(m => 
                 m.id === action.payload ? { ...m, isCompleted: !m.isCompleted } : m
               );
               break;
            }

            case 'ADD_SKILL_NOTE': {
               const { skillId, note } = action.payload;
               activePath.notes = { ...(activePath.notes || {}), [skillId]: note };
               break;
            }

            case 'ACCUMULATE_TIME': {
               activePath.totalTimeMinutes = (activePath.totalTimeMinutes || 0) + action.payload;
               break;
            }

            default:
              break;
          }
      }

      return { paths: newPaths, activePathId: newActivePathId };
    });
  };

  // Expose activePath fields at the root level for backwards compatibility
  const activePath = state.paths.find(p => p.id === state.activePathId) || {};
  const exposedState = {
    ...activePath,
    paths: state.paths,
    activePathId: state.activePathId
  };

  return (
    <NavigatorContext.Provider value={{ state: exposedState, dispatch }}>
      {children}
    </NavigatorContext.Provider>
  );
};
