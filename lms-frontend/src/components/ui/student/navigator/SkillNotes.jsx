import React, { useState, useEffect } from 'react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { StickyNote, Check } from 'lucide-react';

const SkillNotes = ({ path, externalActiveSkillId }) => {
  const { dispatch } = useNavigator();
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const notes = path?.notes || {};
  const currentPath = path?.nodes || [];

  // Sync with external active skill if provided
  useEffect(() => {
    if (externalActiveSkillId) {
      setActiveSkillId(externalActiveSkillId);
    }
  }, [externalActiveSkillId]);

  // Default to the first skill in the path if none selected
  useEffect(() => {
    if (!activeSkillId && !externalActiveSkillId && currentPath.length > 0) {
      setActiveSkillId(currentPath[0].skillId);
    }
  }, [currentPath, activeSkillId, externalActiveSkillId]);

  useEffect(() => {
    if (activeSkillId) {
      setNoteText(notes[activeSkillId] || '');
    }
  }, [activeSkillId, notes]);

  const handleSave = () => {
    if (!activeSkillId) return;
    setIsSaving(true);
    dispatch({
      type: 'ADD_SKILL_NOTE',
      payload: { skillId: activeSkillId, note: noteText }
    });
    setTimeout(() => setIsSaving(false), 500);
  };

  if (currentPath.length === 0) return null;

  return (
    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      {/* Decorative fold */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 border-l border-b border-amber-200 rounded-bl-xl transform origin-top-right shadow-sm"></div>
      
      <div className="flex items-center gap-2 text-amber-900 font-bold mb-4">
        <StickyNote size={18} />
        <h3>Skill Notes</h3>
      </div>

      <div className="mb-3">
        <select 
          value={activeSkillId || ''} 
          onChange={(e) => setActiveSkillId(e.target.value)}
          className="w-full text-sm bg-white/60 border border-amber-200 rounded-lg p-2 text-amber-900 outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold shadow-sm transition-all"
        >
          {currentPath.map(node => (
            <option key={node.skillId} value={node.skillId}>{node.label}</option>
          ))}
        </select>
      </div>

      <div className="relative mt-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add personal notes, helpful links, or reminders for this topic..."
          className="w-full h-32 bg-transparent border-none resize-none outline-hidden text-sm text-amber-900 placeholder-amber-700/50 p-1 font-medium"
        />
        
        <div className="absolute bottom-0 right-0">
          <button 
            onClick={handleSave}
            disabled={noteText === (notes[activeSkillId] || '')}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              isSaving 
                ? 'bg-green-100 text-green-700' 
                : noteText !== (notes[activeSkillId] || '')
                  ? 'bg-amber-200 text-amber-800 hover:bg-amber-300 shadow-sm'
                  : 'text-amber-600/50 opacity-50 cursor-default'
            }`}
          >
            {isSaving ? <Check size={14} /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillNotes;
