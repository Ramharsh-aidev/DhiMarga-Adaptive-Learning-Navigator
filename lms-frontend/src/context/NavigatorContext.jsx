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
import { getResourcesForSkill } from '../data/resources';

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
        const parsed = JSON.parse(uiData.stateJson);
        uiStateRef.current = parsed;
        setUiState(parsed);
      }
      
      const active = (pathsData || []).find(p => p.status === 'active');
      if (active) {
        activePathIdRef.current = active.id;
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
        if (!g) {
          console.warn('Graph endpoint returned empty');
          setCapabilityGraph({ nodes: {}, error: true });
          return;
        }
        
        const nodesObj = (g.nodes || []).reduce((acc, n) => {
          acc[n.skillId] = { 
            ...n, 
            id: n.skillId, 
            prerequisites: (n.prerequisites || []).map(p => typeof p === 'string' ? p : p.skillId), 
            unlocks: [] 
          };
          return acc;
        }, {});
        
        // Synthesize unlocks
        (g.nodes || []).forEach(n => {
          (n.prerequisites || []).forEach(pre => {
             const preId = typeof pre === 'string' ? pre : pre.skillId;
             if (nodesObj[preId]) {
                 nodesObj[preId].unlocks.push(n.skillId);
             }
          });
        });
        
        setCapabilityGraph({ ...g, nodes: nodesObj });
      }).catch(e => {
        console.warn('Graph not found', e);
        setCapabilityGraph({ nodes: {}, error: true });
      });
    } else if (activePathDetail) {
      setCapabilityGraph({ nodes: {}, error: true });
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
      activePathIdRef.current = null;
      setActivePathId(null);
      setActivePathDetail(null);
      const emptyUi = { chatHistory: [], canvasEdits: [], learningDates: [] };
      uiStateRef.current = emptyUi;
      setUiState(emptyUi);
    }
  }, [loadInitialData, isAuthenticated]);

  const scheduleUiSave = (newUiState) => {
    uiStateRef.current = newUiState; // Update ref synchronously for sequential dispatches
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

  const uiStateRef = useRef(uiState);
  const activePathIdRef = useRef(activePathId);
  
  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);
  
  useEffect(() => {
    activePathIdRef.current = activePathId;
  }, [activePathId]);

  const dispatch = useCallback(async (action) => {
    const currentUiState = uiStateRef.current;
    const currentActivePathId = activePathIdRef.current;
    
    switch (action.type) {
      case 'SET_GOAL': {
        const payload = { ...action.payload, graphSlug: action.payload.targetRole };
        const pathData = await createPath(payload);
        setPaths(prev => [pathData, ...prev]);
        activePathIdRef.current = pathData.id;
        setActivePathId(pathData.id);
        const detail = await getPathDetail(pathData.id);
        setActivePathDetail(detail);
        
        // Clear chat history for the new path
        const updatedUi = { ...currentUiState, chatHistory: [] };
        scheduleUiSave(updatedUi);
        break;
      }
      
      case 'SWITCH_PATH': {
        await updatePathStatus(action.payload, { status: 'active' });
        activePathIdRef.current = action.payload;
        setActivePathId(action.payload);
        const detail = await getPathDetail(action.payload);
        setActivePathDetail(detail);
        // refresh paths list to update statuses
        const p = await getUserPaths();
        setPaths(p);
        
        // Clear chat history when switching paths
        const updatedUi = { ...currentUiState, chatHistory: [] };
        scheduleUiSave(updatedUi);
        break;
      }

      case 'DELETE_PATH': {
        await deletePath(action.payload);
        setPaths(prev => prev.filter(p => p.id !== action.payload));
        if (currentActivePathId === action.payload) {
          activePathIdRef.current = null;
          setActivePathId(null);
          setActivePathDetail(null);
        }
        break;
      }

      case 'ARCHIVE_PATH': {
        await updatePathStatus(action.payload, { status: 'archived' });
        const p = await getUserPaths();
        setPaths(p);
        if (currentActivePathId === action.payload) {
          activePathIdRef.current = null;
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
        activePathIdRef.current = action.payload;
        setActivePathId(action.payload);
        const detail = await getPathDetail(action.payload);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }
      
      case 'UPDATE_MASTERY': {
        if (!currentActivePathId) break;
        const { skillId, masteryScore } = action.payload;
        await updateNodeMastery(currentActivePathId, skillId, {
          masteryScore,
          evidenceLevel: 'strong',
          status: masteryScore >= 70 ? 'completed' : 'gap'
        });
        
        // Refresh details
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'REMOVE_SKILL_FROM_PATH': {
        if (!currentActivePathId) break;
        const skillId = action.payload;
        await updateNodeMastery(currentActivePathId, skillId, { status: 'skipped' });
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }

      case 'CONFIGURE_SKILL_IN_PATH': {
        if (!currentActivePathId) break;
        const { skillId, estimatedHours } = action.payload;
        await updateNodeMastery(currentActivePathId, skillId, { estimatedHours });
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }

      case 'ADD_SUBTREE_TO_PATH': {
        // AI personalization injection
        if (!currentActivePathId) break;
        const { nodes } = action.payload;
        if (!nodes || !nodes.length) break;
        
        const detailForSeq = await getPathDetail(currentActivePathId);
        // Find current unverified node to insert BEFORE it
        const currentUnverified = (detailForSeq.nodes || []).find(n => n.status !== 'completed' && n.status !== 'skipped');
        const insertSeq = currentUnverified ? currentUnverified.sequenceOrder : 99;
        
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const resourceObj = (n.resourceTitle && n.resourceUrl) ? {
            title: n.resourceTitle,
            url: n.resourceUrl,
            type: 'video', // default for UI rendering
            learningStyle: 'video'
          } : null;
          
          await addPersonalizationNode(currentActivePathId, {
            skillId: n.id,
            label: n.label,
            category: n.category,
            isAiInjected: true,
            personalizationNote: n.reason || 'AI Personalized Node',
            sequenceOrder: insertSeq, // Will just order them together
            selectedResource: resourceObj ? JSON.stringify(resourceObj) : null
          });
        }
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'ADD_MILESTONE': {
        if (!currentActivePathId) break;
        await addMilestone(currentActivePathId, action.payload);
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'TOGGLE_MILESTONE': {
        if (!currentActivePathId) break;
        await toggleMilestone(currentActivePathId, action.payload);
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'ADD_CHAT_MESSAGE': {
        const updatedUi = { ...currentUiState, chatHistory: [...(currentUiState.chatHistory || []), action.payload] };
        scheduleUiSave(updatedUi);
        break;
      }
      
      case 'UPDATE_CANVAS': {
        const updatedUi = { ...currentUiState, canvasEdits: action.payload };
        scheduleUiSave(updatedUi);
        break;
      }

      case 'SET_PATH_STATUS': {
        if (!currentActivePathId) break;
        await updatePathStatus(currentActivePathId, { status: action.payload });
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }
      
      case 'SET_CONTENT_MODE': {
        if (!currentActivePathId) break;
        await updateContentMode(currentActivePathId, action.payload);
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        break;
      }
      
      case 'TRIGGER_RECOVERY': {
        if (!currentActivePathId) break;
        await updatePathStatus(currentActivePathId, { status: 'blocked' });
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }
      
      case 'REPLAN_PATH': {
        if (!currentActivePathId) break;
        await updatePathStatus(currentActivePathId, { status: 'planning' });
        const detail = await getPathDetail(currentActivePathId);
        setActivePathDetail(detail);
        const p = await getUserPaths();
        setPaths(p);
        break;
      }

      default:
        console.warn('Unhandled action type in NavigatorContext:', action.type);
        break;
    }
  }, []);

  // Backward compatibility adapter
  const exposedState = {
    paths,
    activePathId,
    goal: activePathDetail ? { targetRole: activePathDetail.targetRole, deadlineWeeks: activePathDetail.deadlineWeeks, hoursPerWeek: activePathDetail.hoursPerWeek, contentMode: activePathDetail.contentMode } : null,
    pathStatus: activePathDetail?.status || activePathDetail?.pathStatus || 'planning',
    currentPath: (activePathDetail?.nodes || []).map(n => {
      let selectedResource = null;
      if (n.selectedResource) {
        try {
          selectedResource = typeof n.selectedResource === 'string' ? JSON.parse(n.selectedResource) : n.selectedResource;
        } catch (e) {
          console.warn("Failed to parse selectedResource", e);
        }
      }
      
      if (!selectedResource) {
        const resources = getResourcesForSkill(n.skillId, activePathDetail.contentMode || 'mentor');
        selectedResource = resources && resources.length > 0 
          ? (resources.find(r => r.learningStyle === activePathDetail.learningPreference) || resources[0]) 
          : null;
      }
        
      return {
        ...n,
        selectedResource,
        nodeRef: { label: n.label, category: 'Skill' } // shim for frontend bugs
      };
    }),
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
