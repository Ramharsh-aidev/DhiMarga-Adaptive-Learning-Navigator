import React, { useState } from 'react';
import { useNavigator } from '../../../../context/NavigatorContext';
import { Target, Plus, Check, X } from 'lucide-react';

const MilestonesPanel = ({ path }) => {
  const { dispatch } = useNavigator();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const milestones = path?.milestones || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    
    dispatch({ 
      type: 'ADD_MILESTONE', 
      payload: { 
        id: Date.now().toString(), 
        title: newTitle.trim(), 
        targetDate: newDate, 
        isCompleted: false 
      }
    });
    
    setNewTitle('');
    setNewDate('');
    setIsAdding(false);
  };

  const toggleMilestone = (id) => {
    dispatch({ type: 'TOGGLE_MILESTONE', payload: id });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Target size={18} className="text-rose-500" />
          <h3>Path Milestones</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-violet-600 transition-colors"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
          <input 
            type="text" 
            placeholder="E.g., Complete Python basics" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-hidden font-medium"
            autoFocus
          />
          <div className="flex gap-2">
            <input 
              type="date" 
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-hidden text-slate-600 font-medium"
            />
            <button 
              type="submit"
              disabled={!newTitle || !newDate}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {milestones.length === 0 && !isAdding ? (
        <p className="text-sm text-slate-400 italic text-center py-4 font-medium">No milestones set yet.</p>
      ) : (
        <ul className="space-y-2">
          {milestones.map(m => (
            <li key={m.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors">
              <button 
                onClick={() => toggleMilestone(m.id)}
                className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  m.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-violet-400'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${m.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {m.title}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  By {new Date(m.targetDate).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MilestonesPanel;
