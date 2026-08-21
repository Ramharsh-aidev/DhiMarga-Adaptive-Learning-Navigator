import React, { useState, useEffect } from 'react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { StickyNote, Check } from 'lucide-react';

const SkillNotes = ({ path }) => {
  const { dispatch } = useNavigator();
  const [activeSkillId, setActiveSkillId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const notes = path?.notes || {};
  const currentPath = path?.currentPath || [];

  // Default to the first skill in the path if none selected
  useEffect(() => {
    if (!activeSkillId && currentPath.length > 0) {
      setActiveSkillId(currentPath[0].skillId);
    }
  }, [currentPath, activeSkillId]);

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
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
      {/* Decorative fold */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 border-l border-b border-amber-200 rounded-bl-lg transform origin-top-right"></div>
      
      <div className="flex items-center gap-2 text-amber-800 font-semibold mb-4">
        <StickyNote size={18} />
        <h3>Skill Notes</h3>
      </div>

      <div className="mb-3">
        <select 
          value={activeSkillId || ''} 
          onChange={(e) => setActiveSkillId(e.target.value)}
          className="w-full text-sm bg-white/50 border border-amber-300 rounded-md p-2 text-amber-900 outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
        >
          {currentPath.map(node => (
            <option key={node.skillId} value={node.skillId}>{node.label}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add personal notes, helpful links, or reminders for this topic..."
          className="w-full h-32 bg-transparent border-none resize-none outline-hidden text-sm text-amber-900 placeholder-amber-700/50 p-1"
        />
        
        <div className="absolute bottom-0 right-0">
          <button 
            onClick={handleSave}
            disabled={noteText === (notes[activeSkillId] || '')}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all ${
              isSaving 
                ? 'bg-green-100 text-green-700' 
                : noteText !== (notes[activeSkillId] || '')
                  ? 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                  : 'text-amber-600 opacity-50 cursor-default'
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
