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
      <div className={`bg-white rounded-xl shadow-sm border ${isActive ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-gray-200'} mb-4 overflow-hidden transition-all`}>
        {/* Header Summary */}
        <div 
          className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : path.id)}
        >
          {/* Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-gray-100" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.827} 282.7`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">{progress}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {path.goal?.targetRole ? path.goal.targetRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Learning Path'}
              </h3>
              {isActive && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>}
              {path.status === 'paused' && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">Paused</span>}
              {path.status === 'completed' && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Completed</span>}
              {path.status === 'archived' && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">Archived</span>}
            </div>
            
            <p className="text-sm text-gray-500 flex items-center gap-4">
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
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100"
                  >
                    <Play size={16} /> {path.status === 'paused' ? 'Resume' : 'Switch To'}
                  </button>
                ) : (
                  <button 
                    onClick={(e) => handleAction(e, 'PAUSE_PATH', path.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100"
                  >
                    <Pause size={16} /> Pause
                  </button>
                )}
              </>
            )}
            
            {path.status !== 'archived' && (
              <button 
                onClick={(e) => handleAction(e, 'ARCHIVE_PATH', path.id)}
                className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg"
                title="Archive"
              >
                <Archive size={16} />
              </button>
            )}

            <button 
              onClick={(e) => handleAction(e, 'DELETE_PATH', path.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>

            <div className="p-1.5 text-gray-400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-slate-50 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Path Overview</h4>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Up Next</span>
                </div>
                {nextSkill ? (
                  <p className="font-medium text-blue-700">{nextSkill.label}</p>
                ) : (
                  <p className="text-sm text-gray-500">No pending skills.</p>
                )}
              </div>

              <h4 className="text-sm font-semibold text-gray-800 mb-3">All Skills</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {path.currentPath?.map((skill, idx) => {
                  const state = path.learnerState?.[skill.skillId];
                  const isVerified = state?.status === 'verified';
                  const isGap = state?.status === 'gap';
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 text-sm">
                      <span className={`font-medium ${isVerified ? 'text-green-700' : isGap ? 'text-orange-600' : 'text-gray-700'}`}>
                        {skill.label}
                      </span>
                      {state?.masteryScore !== undefined && (
                        <span className="text-xs text-gray-500">{state.masteryScore}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Details</h4>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex justify-between border-b pb-2">
                  <span>Started On</span>
                  <span className="font-medium">{new Date(path.createdAt).toLocaleDateString()}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Target Deadline</span>
                  <span className="font-medium">{path.goal?.deadline ? `${path.goal.deadline} weeks` : 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Weekly Commitment</span>
                  <span className="font-medium">{path.goal?.availableHoursPerWeek ? `${path.goal.availableHoursPerWeek} hrs/wk` : 'N/A'}</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Known Skills</span>
                  <span className="font-medium text-right max-w-[150px] truncate">{path.goal?.knownSkills?.join(', ') || 'None'}</span>
                </li>
              </ul>
              
              {isActive && (
                <button 
                  onClick={() => navigate('/student/navigator/dashboard')}
                  className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900">My Learning Paths</h1>
            <p className="text-gray-500 mt-1">Manage and track your personalized AI Navigator journeys.</p>
          </div>
          <button 
            onClick={() => navigate('/student/navigator')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Compass size={18} /> New Path
          </button>
        </div>

        {paths.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <Compass size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No paths found</h3>
            <p className="text-gray-500 mb-6">Start a new personalized learning journey.</p>
            <button 
              onClick={() => navigate('/student/navigator')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Create Your First Path
            </button>
          </div>
        ) : (
          <>
            {activeOrPaused.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Active & Paused</h2>
                {activeOrPaused.map(path => (
                  <PathCard key={path.id} path={path} />
                ))}
              </div>
            )}

            {archivedOrCompleted.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-gray-500">Archived & Completed</h2>
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
