import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigator } from '../../context/NavigatorContext';
import Layout from '../../components/layout/Layout';
import { Route, Play, Pause, Archive, Trash2, Clock, CheckCircle2, ChevronDown, ChevronUp, Compass } from 'lucide-react';
import MiniMindMap from '../../components/ui/student/navigator/MiniMindMap';
import SkillRadarChart from '../../components/ui/student/navigator/SkillRadarChart';
import LearningCalendar from '../../components/ui/student/navigator/LearningCalendar';
import MilestonesPanel from '../../components/ui/student/navigator/MilestonesPanel';
import SkillNotes from '../../components/ui/student/navigator/SkillNotes';

const MyPaths = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  
  const [expandedId, setExpandedId] = useState(null);

  const { paths, activePathId } = state;

  const handleAction = (e, actionType, pathId) => {
    e.stopPropagation();
    dispatch({ type: actionType, payload: pathId });
    if (actionType === 'SWITCH_PATH' || actionType === 'RESUME_PATH') {
      navigate('/student/navigator/dashboard');
    }
  };

  const activeOrPaused = paths.filter(p => p.status === 'active' || p.status === 'paused');
  const archivedOrCompleted = paths.filter(p => p.status === 'archived' || p.status === 'completed');

  const PathCard = ({ path }) => {
    const isExpanded = expandedId === path.id;
    const isActive = activePathId === path.id && path.status === 'active';

    const completedSkills = path.learnerState ? Object.values(path.learnerState).filter(s => s.status === 'verified').length : 0;
    const totalSkills = path.currentPath?.length || 0;
    const progress = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100);

    const nextSkill = path.currentPath?.find(n => n.status === 'current');

    return (
      <div className={`bg-white rounded-2xl shadow-sm border ${isActive ? 'border-violet-400 ring-2 ring-violet-400/20' : 'border-slate-200'} mb-4 overflow-hidden transition-all`}>
        {/* Header Summary */}
        <div 
          className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : path.id)}
        >
          {/* Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-slate-100" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-violet-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.827} 282.7`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-slate-900">{progress}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                {path.goal?.targetRole ? path.goal.targetRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Learning Path'}
              </h3>
              {isActive && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200">Active</span>}
              {path.status === 'paused' && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-200">Paused</span>}
              {path.status === 'completed' && <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-bold border border-violet-200">Completed</span>}
              {path.status === 'archived' && <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold border border-slate-200">Archived</span>}
            </div>
            
            <p className="text-sm text-slate-500 flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 size={14}/> {completedSkills}/{totalSkills} Skills</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {path.totalTimeMinutes || 0} mins</span>
              <span className="flex items-center gap-1">Mode: {path.goal?.contentMode === 'mentor' ? 'Mentor' : 'Open Source'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {path.status !== 'completed' && path.status !== 'archived' && (
              <>
                {!isActive ? (
                  <button 
                    onClick={(e) => handleAction(e, path.status === 'paused' ? 'RESUME_PATH' : 'SWITCH_PATH', path.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-100 transition-colors"
                  >
                    <Play size={16} /> {path.status === 'paused' ? 'Resume' : 'Switch To'}
                  </button>
                ) : (
                  <button 
                    onClick={(e) => handleAction(e, 'PAUSE_PATH', path.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors"
                  >
                    <Pause size={16} /> Pause
                  </button>
                )}
              </>
            )}
            
            {path.status !== 'archived' && (
              <button 
                onClick={(e) => handleAction(e, 'ARCHIVE_PATH', path.id)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl transition-colors"
                title="Archive"
              >
                <Archive size={16} />
              </button>
            )}

            <button 
              onClick={(e) => handleAction(e, 'DELETE_PATH', path.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-xl transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>

            <div className="p-1.5 text-slate-400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-b-2xl">
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Path Overview</h4>
              
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Up Next</span>
                </div>
                {nextSkill ? (
                  <p className="font-bold text-violet-700">{nextSkill.label}</p>
                ) : (
                  <p className="text-sm text-slate-500 font-medium">No pending skills.</p>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-3">All Skills</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {path.currentPath?.map((skill, idx) => {
                  const state = path.learnerState?.[skill.skillId];
                  const isVerified = state?.status === 'verified';
                  const isGap = state?.status === 'gap';
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-sm shadow-sm">
                      <span className={`font-bold ${isVerified ? 'text-green-700' : isGap ? 'text-amber-600' : 'text-slate-700'}`}>
                        {skill.label}
                      </span>
                      {state?.masteryScore !== undefined && (
                        <span className="text-xs text-slate-500 font-bold">{state.masteryScore}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 mb-4">Details</h4>
              <ul className="text-sm text-slate-600 space-y-3 font-medium">
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Started On</span>
                  <span className="font-bold text-slate-900">{new Date(path.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Target Deadline</span>
                  <span className="font-bold text-slate-900">{path.goal?.deadline ? `${path.goal.deadline} weeks` : 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Weekly Commitment</span>
                  <span className="font-bold text-slate-900">{path.goal?.availableHoursPerWeek ? `${path.goal.availableHoursPerWeek} hrs/wk` : 'N/A'}</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Known Skills</span>
                  <span className="font-bold text-slate-900 text-right max-w-[150px] truncate">{path.goal?.knownSkills?.join(', ') || 'None'}</span>
                </li>
              </ul>
              
              {isActive && (
                <button 
                  onClick={() => navigate('/student/navigator/dashboard')}
                  className="mt-6 w-full py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all"
                >
                  Go to Dashboard →
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-6">
              <SkillRadarChart path={path} width={220} height={220} />
              <LearningCalendar path={path} />
            </div>

            <div className="flex flex-col gap-6">
              <MilestonesPanel path={path} />
              <SkillNotes path={path} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Learning Paths</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your personalized AI Navigator journeys.</p>
          </div>
          <button 
            onClick={() => navigate('/student/navigator')}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all"
          >
            <Compass size={18} /> New Path
          </button>
        </div>

        {paths.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Compass size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No paths found</h3>
            <p className="text-slate-500 mb-6 font-medium">Start a new personalized learning journey.</p>
            <button 
              onClick={() => navigate('/student/navigator')}
              className="px-6 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all"
            >
              Create Your First Path
            </button>
          </div>
        ) : (
          <>
            {activeOrPaused.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Active & Paused</h2>
                {activeOrPaused.map(path => (
                  <PathCard key={path.id} path={path} />
                ))}
              </div>
            )}

            {archivedOrCompleted.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-500 mb-4">Archived & Completed</h2>
                {archivedOrCompleted.map(path => (
                  <PathCard key={path.id} path={path} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyPaths;
