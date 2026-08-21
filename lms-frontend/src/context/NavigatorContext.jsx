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
    goal: null,
    capabilityGraph: null,
    learnerState: {},
    currentPath: [],
    pathStatus: 'planning',
    recoveryHistory: [],
    chatHistory: [],
    canvasEdits: [],
  });

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NAVIGATOR);
    if (stored) {
      try {
        setState(JSON.parse(stored));
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
      let newState = { ...prevState };
      
      switch (action.type) {
        case 'SET_GOAL': {
          const goal = action.payload;
          newState.goal = goal;
          newState.capabilityGraph = capabilityGraphs[goal.targetRole];
          
          // Initialize learner state with known skills
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
          newState.learnerState = newLearnerState;
          
          // Generate initial path
          if (newState.capabilityGraph) {
            newState.currentPath = generatePath(goal, newLearnerState, newState.capabilityGraph);
          }
          newState.pathStatus = 'planning';
          newState.chatHistory = [];
          newState.recoveryHistory = [];
          break;
        }
        
        case 'ADD_CHAT_MESSAGE':
          newState.chatHistory = [...newState.chatHistory, action.payload];
          break;
          
        case 'SET_PATH_STATUS':
          newState.pathStatus = action.payload;
          break;
          
        case 'REPLAN_PATH':
          if (newState.capabilityGraph && newState.currentPath.length > 0) {
            newState.currentPath = replanPath(newState.currentPath, newState.learnerState, newState.capabilityGraph);
          }
          break;

        case 'UPDATE_CONSTRAINT': {
          if (newState.goal) {
            newState.goal = { ...newState.goal, [action.payload.field]: action.payload.value };
            // Recalculate budget if hours/deadline changed
            if (action.payload.field === 'deadline' || action.payload.field === 'availableHoursPerWeek') {
               const wks = parseInt(newState.goal.deadline) || 12;
               newState.goal.totalBudgetHours = wks * (newState.goal.availableHoursPerWeek || 10);
            }
            if (newState.capabilityGraph && newState.currentPath.length > 0) {
              newState.currentPath = replanPath(newState.currentPath, newState.learnerState, newState.capabilityGraph);
            }
          }
          break;
        }

        case 'ADD_SKILL_TO_PATH': {
          const rawSkillId = action.payload;
          const nodes = newState.capabilityGraph?.nodes || {};

          // 1. Try exact match first
          let resolvedId = nodes[rawSkillId] ? rawSkillId : null;

          // 2. Fuzzy match: normalize both sides (lowercase, underscores) and check substring
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
            // Add known graph node if not already in path
            if (!newState.currentPath.find(n => n.skillId === resolvedId)) {
              newState.currentPath = [
                ...newState.currentPath,
                {
                  skillId: resolvedId,
                  order: newState.currentPath.length,
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
            // 3. Not found in graph — add as custom skill node
            const customId = rawSkillId.toLowerCase().replace(/\s+/g, '_');
            const humanLabel = rawSkillId.replace(/_/g, ' ');
            if (!newState.currentPath.find(n => n.skillId === customId)) {
              // Also inject it into the capability graph so the mind map shows it
              newState.capabilityGraph = {
                ...newState.capabilityGraph,
                nodes: {
                  ...newState.capabilityGraph.nodes,
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
              newState.currentPath = [
                ...newState.currentPath,
                {
                  skillId: customId,
                  order: newState.currentPath.length,
                  status: 'upcoming',
                  estimatedHours: 3,
                  selectedResource: null,
                  isUserAdded: true,
                  isRecovery: false,
                  nodeRef: newState.capabilityGraph.nodes[customId]
                }
              ];
            }
          }
          break;
        }

        case 'REMOVE_SKILL_FROM_PATH': {
          newState.currentPath = newState.currentPath.filter(n => n.skillId !== action.payload);
          break;
        }
        
        case 'UPDATE_MASTERY': {
          const { skillId, masteryScore } = action.payload;
          newState.learnerState = {
            ...newState.learnerState,
            [skillId]: {
              ...newState.learnerState[skillId],
              skillId,
              masteryScore,
              evidenceLevel: 'strong',
              status: masteryScore >= (newState.capabilityGraph?.nodes?.[skillId]?.masteryThreshold || 60) ? 'verified' : 'gap'
            }
          };
          break;
        }
        
        case 'ADD_SUBTREE_TO_PATH': {
          const { nodes: newNodes } = action.payload;
          if (!newNodes || newNodes.length === 0) break;

          const newNodeIds = new Set(newNodes.map(n => n.id));
          
          // Step 1: Build updated graph with all new nodes injected
          const updatedGraphNodes = { ...newState.capabilityGraph.nodes };
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

          // Step 2: Wire backwards — for new "entry" nodes (prerequisites point to EXISTING nodes),
          // add them to the existing node's unlocks so the mind map tree can traverse to them.
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
            // If no prerequisites at all, treat as root — wire from capabilityGraph root anchor
            if ((n.prerequisites || []).length === 0) {
              // No external wiring needed; buildDepTree picks up zero-prerequisite nodes as roots
            }
          });

          newState.capabilityGraph = { ...newState.capabilityGraph, nodes: updatedGraphNodes };

          // Step 3: Add nodes to path (topological sort — foundational nodes first)
          const inPath = new Set(newState.currentPath.map(p => p.skillId));
          const sorted = [...newNodes].sort((a, b) => {
            const aHasNewDeps = (a.prerequisites || []).some(pId => newNodeIds.has(pId));
            const bHasNewDeps = (b.prerequisites || []).some(pId => newNodeIds.has(pId));
            return aHasNewDeps === bHasNewDeps ? 0 : aHasNewDeps ? 1 : -1;
          });

          const additions = sorted
            .filter(n => !inPath.has(n.id))
            .map((n, idx) => ({
              skillId: n.id,
              order: newState.currentPath.length + idx,
              status: 'upcoming',
              estimatedHours: n.estimatedHours || 3,
              selectedResource: null,
              isUserAdded: true,
              isRecovery: false,
              nodeRef: updatedGraphNodes[n.id],
            }));

          newState.currentPath = [...newState.currentPath, ...additions];
          break;
        }

        case 'CONFIGURE_SKILL_IN_PATH': {
          // payload: { skillId, estimatedHours }
          const { skillId: cfgId, estimatedHours } = action.payload;
          newState.currentPath = newState.currentPath.map(item =>
            item.skillId === cfgId
              ? { ...item, estimatedHours: estimatedHours ?? item.estimatedHours }
              : item
          );
          break;
        }

        case 'SET_CONTENT_MODE': {
          if (newState.goal) {
            newState.goal = { ...newState.goal, contentMode: action.payload };
            
            // Re-assign resources for existing path
            newState.currentPath = newState.currentPath.map(item => {
              const resources = getResourcesForSkill(item.skillId, action.payload);
              if (resources && resources.length > 0) {
                const selectedResource = resources.find(r => r.learningStyle === newState.goal.learningPreference) || resources[0];
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

        case 'TRIGGER_RECOVERY': {
           newState.pathStatus = 'blocked';
           break;
        }
        
        case 'CLEAR_STATE':
           newState = {
              goal: null,
              capabilityGraph: null,
              learnerState: {},
              currentPath: [],
              pathStatus: 'planning',
              recoveryHistory: [],
              chatHistory: [],
              canvasEdits: [],
           };
           break;

        default:
          break;
      }
      return newState;
    });
  };

  return (
    <NavigatorContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigatorContext.Provider>
  );
};
