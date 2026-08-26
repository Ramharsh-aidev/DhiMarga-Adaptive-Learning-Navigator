import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook to manage optimistic UI edits for paths before committing to the backend.
 * Industry standard pattern for separating draft state from canonical context state.
 */
export const usePathDrafts = (currentPath, capabilityGraph) => {
  // Array of draft actions: { type: 'REMOVE' | 'ADD_SUBTREE' | 'ADD_SKILL', payload: any }
  const [draftEdits, setDraftEdits] = useState([]);

  const addDraft = useCallback((draft) => {
    setDraftEdits((prev) => [...prev, draft]);
  }, []);

  const clearDrafts = useCallback(() => {
    setDraftEdits([]);
  }, []);

  const discardDraft = useCallback((index) => {
    setDraftEdits((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Compute the derived path by applying drafts sequentially over the canonical path
  const projectedPath = useMemo(() => {
    let projected = [...(currentPath || [])];
    
    draftEdits.forEach(draft => {
      if (draft.type === 'REMOVE_SKILLS') {
        for (const skillId of draft.payload.skillIds) {
          const idx = projected.findIndex(n => n.skillId === skillId);
          if (idx !== -1) {
            projected[idx] = { ...projected[idx], draftStatus: 'pending_removal' };
          }
        }
      } else if (draft.type === 'ADD_SUBTREE') {
        // Inject new nodes as pending_addition
        const { nodes, insertSeq } = draft.payload;
        const mappedNodes = nodes.map((n, i) => ({
          id: `draft_${n.id}`,
          skillId: n.id,
          label: n.label,
          category: n.category,
          isAiInjected: true,
          personalizationNote: n.reason || 'AI Personalized Node',
          sequenceOrder: insertSeq + (i * 0.1), // ensure they order properly in UI
          status: 'upcoming',
          draftStatus: 'pending_addition',
          nodeRef: { label: n.label, category: n.category || 'Skill' }
        }));
        
        // Push them to projected array
        projected = [...projected, ...mappedNodes];
      } else if (draft.type === 'ADD_SKILL') {
        const skillId = draft.payload.skillId;
        const nodeRef = capabilityGraph?.nodes?.[skillId];
        if (nodeRef) {
          projected.push({
            id: `draft_${skillId}`,
            skillId: skillId,
            label: nodeRef.label,
            category: nodeRef.category,
            status: 'upcoming',
            draftStatus: 'pending_addition',
            nodeRef
          });
        }
      }
    });
    
    // Sort by sequenceOrder just in case CanvasPath uses it
    return projected.sort((a, b) => (a.sequenceOrder || 99) - (b.sequenceOrder || 99));
  }, [currentPath, draftEdits, capabilityGraph]);

  return {
    draftEdits,
    projectedPath,
    addDraft,
    clearDrafts,
    discardDraft
  };
};
