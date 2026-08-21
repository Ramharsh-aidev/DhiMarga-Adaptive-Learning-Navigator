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
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <Target size={18} className="text-orange-500" />
          <h3>Path Milestones</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <input 
            type="text" 
            placeholder="E.g., Complete Python basics" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full mb-2 text-sm px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-hidden"
            autoFocus
          />
          <div className="flex gap-2">
            <input 
              type="date" 
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 text-sm px-3 py-2 border rounded-md focus:ring-1 focus:ring-indigo-500 outline-hidden text-slate-600"
            />
            <button 
              type="submit"
              disabled={!newTitle || !newDate}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {milestones.length === 0 && !isAdding ? (
        <p className="text-sm text-slate-400 italic text-center py-4">No milestones set yet.</p>
      ) : (
        <ul className="space-y-2">
          {milestones.map(m => (
            <li key={m.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg group">
              <button 
                onClick={() => toggleMilestone(m.id)}
                className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  m.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-400'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${m.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {m.title}
                </p>
                <p className="text-xs text-slate-500">
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
