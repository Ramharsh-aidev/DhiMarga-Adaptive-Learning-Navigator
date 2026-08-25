import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAvailableGraphs,
  getGraph,
  getUserPaths, 
  getPathDetail, 
  createPath, 
  updatePathStatus, 
  deletePath,
  updateNodeMastery, 
  addPersonalizationNode, 
  addMilestone, 
  toggleMilestone,
  getUiState,
  saveUiState,
  updateContentMode
} from '../services/navigatorService';

const NavigatorContext = createContext();

export const useNavigator = () => useContext(NavigatorContext);

import { useAuth } from '../hooks/useAuth';

export const NavigatorProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activePathId, setActivePathId] = useState(null);
  const [paths, setPaths] = useState([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState(true);
  const [activePathDetail, setActivePathDetail] = useState(null);
  const [capabilityGraph, setCapabilityGraph] = useState(null);
  
  // UI State Blob (chatHistory, canvasEdits, learningDates)
  const [uiState, setUiState] = useState({ chatHistory: [], canvasEdits: [], learningDates: [] });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  
  const uiSaveTimeoutRef = useRef(null);

  // Load everything on mount
  const loadInitialData = useCallback(async () => {
    setIsLoadingPaths(true);
    try {
      const [pathsData, uiData] = await Promise.all([
        getUserPaths(),
        getUiState()
      ]);
      
      setPaths(pathsData || []);
      
      if (uiData && uiData.stateJson) {
        setUiState(JSON.parse(uiData.stateJson));
      }
      
      const active = (pathsData || []).find(p => p.status === 'active');
      if (active) {
        setActivePathId(active.id);
        const detail = await getPathDetail(active.id);
        setActivePathDetail(detail);
      }
    } catch (err) {
      console.error('Failed to load navigator state', err);
    } finally {
      setIsLoadingPaths(false);
    }
  }, []);

  useEffect(() => {
    if (activePathDetail && (activePathDetail.targetRole || activePathDetail.graph?.slug)) {
      const slug = activePathDetail.targetRole || activePathDetail.graph?.slug;
      getGraph(slug).then(g => {
        const nodesObj = (g.nodes || []).reduce((acc, n) => {
          acc[n.skillId] = { ...n, id: n.skillId, unlocks: [] };
          return acc;
        }, {});
        
        // Synthesize unlocks
        (g.nodes || []).forEach(n => {
          (n.prerequisites || []).forEach(pre => {
             if (nodesObj[pre.skillId]) {
                 nodesObj[pre.skillId].unlocks.push(n.skillId);
             }
          });
        });
        
        setCapabilityGraph({ ...g, nodes: nodesObj });
      }).catch(e => {
        console.warn('Graph not found', e);
        setCapabilityGraph({ nodes: {}, error: true });
      });
    } else {
      setCapabilityGraph(null);
    }
  }, [activePathDetail?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    } else {
      // Clear state when user logs out
      setPaths([]);
      setActivePathId(null);
      setActivePathDetail(null);
      setUiState({ chatHistory: [], canvasEdits: [], learningDates: [] });
    }
  }, [loadInitialData, isAuthenticated]);

  // Debounced save for UI state
  const scheduleUiSave = (newUiState) => {
    setUiState(newUiState);
    if (uiSaveTimeoutRef.current) clearTimeout(uiSaveTimeoutRef.current);
    
    uiSaveTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      try {
        await saveUiState(newUiState);
        setLastSyncedAt(new Date());
      } catch (e) {
        console.error('Failed to save UI state', e);
      } finally {
        setIsSyncing(false);
      }
    }, 1500);
  };

  const dispatch = useCallback(async (action) => {
    switch (action.type) {
      case 'SET_GOAL': {
        const payload = { ...action.payload, graphSlug: action.payload.targetRole };
        const pathData = await createPath(payload);
        setPaths(prev => [pathData, ...prev]);
        setActivePathId(pathData.id);
        const detail = await getPathDetail(pathData.id);
        setActivePathDetail(detail);
        break;
      }
      
      case 'SWITCH_PATH': {
        await updatePathStatus(action.payload, { status: 'active' });
        setActivePathId(action.payload);
        const detail = await getPathDetail(action.payload);
        setActivePathDetail(detail);
        // refresh paths list to update statuses
        const p = await getUserPaths();
        setPaths(p);
        break;
      }

      case 'DELETE_PATH': {
        await deletePath(action.payload);
        setPaths(prev => prev.filter(p => p.id !== action.payload));
        if (activePathId === action.payload) {
          setActivePathId(null);
          setActivePathDetail(null);
        }
        break;
      }

      case 'ARCHIVE_PATH': {
        await updatePathStatus(action.payload, { status: 'archived' });
        const p = await getUserPaths();
        setPaths(p);
        if (activePathId === action.payload) {
          setActivePathId(null);
          setActivePathDetail(null);
        }
        break;
      }

      case 'PAUSE_PATH': {
        await updatePathStatus(action.payload, { status: 'paused' });
        const p = await getUserPaths();
        setPaths(p);
        break;
      }

      case 'RESUME_PATH': {
        await updatePathStatus(action.payload, { status: 'active' });
        setActivePathId(action.payload);
        const detail = await getPathDetail(action.payload);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }
      
      case 'UPDATE_MASTERY': {
        if (!activePathId) break;
        const { skillId, masteryScore } = action.payload;
        await updateNodeMastery(activePathId, skillId, {
          masteryScore,
          evidenceLevel: 'strong',
          status: masteryScore >= 70 ? 'completed' : 'gap'
        });
        
        // Refresh details
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'REMOVE_SKILL_FROM_PATH': {
        if (!activePathId) break;
        const skillId = action.payload;
        await updateNodeMastery(activePathId, skillId, { status: 'skipped' });
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }

      case 'CONFIGURE_SKILL_IN_PATH': {
        if (!activePathId) break;
        const { skillId, estimatedHours } = action.payload;
        await updateNodeMastery(activePathId, skillId, { estimatedHours });
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }

      case 'ADD_SUBTREE_TO_PATH': {
        // AI personalization injection
        if (!activePathId) break;
        const { nodes } = action.payload;
        if (!nodes || !nodes.length) break;
        
        for (const n of nodes) {
          await addPersonalizationNode(activePathId, {
            skillId: n.id,
            label: n.label,
            category: n.category,
            isAiInjected: true,
            personalizationNote: n.reason || 'AI Remedial Node',
            sequenceOrder: 99 // simplistic append for now
          });
        }
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'ADD_MILESTONE': {
        if (!activePathId) break;
        await addMilestone(activePathId, action.payload);
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'TOGGLE_MILESTONE': {
        if (!activePathId) break;
        await toggleMilestone(activePathId, action.payload);
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'ADD_CHAT_MESSAGE': {
        const updatedUi = { ...uiState, chatHistory: [...(uiState.chatHistory || []), action.payload] };
        scheduleUiSave(updatedUi);
        break;
      }
      
      case 'UPDATE_CANVAS': {
        const updatedUi = { ...uiState, canvasEdits: action.payload };
        scheduleUiSave(updatedUi);
        break;
      }

      case 'SET_PATH_STATUS': {
        if (!activePathId) break;
        await updatePathStatus(activePathId, { status: action.payload });
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }
      
      case 'SET_CONTENT_MODE': {
        if (!activePathId) break;
        await updateContentMode(activePathId, action.payload);
        const detail = await getPathDetail(activePathId);
        setActivePathDetail(detail);
        break;
      }
      
      default:
        console.warn('Unhandled action type in NavigatorContext:', action.type);
        break;
    }
  }, [activePathId, uiState]);

  // Backward compatibility adapter
  const exposedState = {
    paths,
    activePathId,
    goal: activePathDetail ? { targetRole: activePathDetail.targetRole, deadlineWeeks: activePathDetail.deadlineWeeks, hoursPerWeek: activePathDetail.hoursPerWeek, contentMode: activePathDetail.contentMode } : null,
    pathStatus: activePathDetail?.status || activePathDetail?.pathStatus || 'planning',
    currentPath: (activePathDetail?.nodes || []).map(n => ({
      ...n,
      nodeRef: { label: n.label, category: 'Skill' } // shim for frontend bugs
    })),
    capabilityGraph: capabilityGraph,
    learnerState: (activePathDetail?.nodes || []).reduce((acc, n) => {
      acc[n.skillId] = { status: n.status === 'completed' ? 'verified' : n.status === 'gap' ? 'gap' : 'current', masteryScore: n.masteryScore };
      return acc;
    }, {}),
    milestones: activePathDetail?.milestones || [],
    chatHistory: uiState.chatHistory || [],
    canvasEdits: uiState.canvasEdits || [],
    learningDates: uiState.learningDates || [],
    totalTimeMinutes: activePathDetail?.totalTimeMinutes || 0,
    isSyncing,
    lastSyncedAt,
    isLoadingPaths
  };

  return (
    <NavigatorContext.Provider value={{ state: exposedState, dispatch }}>
      {children}
    </NavigatorContext.Provider>
  );
};
