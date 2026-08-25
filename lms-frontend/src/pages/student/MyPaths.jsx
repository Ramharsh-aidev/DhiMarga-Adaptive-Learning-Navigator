import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigator } from '../../context/NavigatorContext';
import Layout from '../../components/layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Play, Pause, Archive, Trash2, Clock, CheckCircle2, ChevronDown, ChevronUp, Compass, Flame, Star } from 'lucide-react';
import MiniMindMap from '../../components/ui/student/navigator/MiniMindMap';
import SkillRadarChart from '../../components/ui/student/navigator/SkillRadarChart';
import LearningCalendar from '../../components/ui/student/navigator/LearningCalendar';
import LearningVelocityChart from '../../components/ui/student/navigator/LearningVelocityChart';
import MilestonesPanel from '../../components/ui/student/navigator/MilestonesPanel';
import SkillNotes from '../../components/ui/student/navigator/SkillNotes';

const calculateStreak = (nodes) => {
  if (!nodes || nodes.length === 0) return 0;
  
  const dates = nodes
    .filter(n => n.completedAt)
    .map(n => new Date(n.completedAt).toISOString().split('T')[0])
    .sort((a, b) => new Date(b) - new Date(a));
    
  if (dates.length === 0) return 0;
  
  // Deduplicate dates
  const uniqueDates = [...new Set(dates)];
  
  // Check if today or yesterday is the most recent
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let currentStreak = 0;
  let currentDate = new Date(uniqueDates[0]);
  
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0; // Streak broken
  }
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i]);
    if (i === 0) {
      currentStreak++;
    } else {
      const diffTime = Math.abs(currentDate - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) {
        currentStreak++;
        currentDate = d;
      } else {
        break;
      }
    }
  }
  return currentStreak;
};

const MyPaths = () => {
  const { state, dispatch } = useNavigator();
  const navigate = useNavigate();
  
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const { paths, activePathId } = state;

  const handleAction = (e, actionType, pathId) => {
    e.stopPropagation();
    dispatch({ type: actionType, payload: pathId });
    if (actionType === 'SWITCH_PATH' || actionType === 'RESUME_PATH') {
      navigate('/student/navigator/dashboard');
    }
  };

  const filteredPaths = paths.filter(p => 
    !searchQuery || 
    (p.targetRole && p.targetRole.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    if (sortBy === 'progress') {
      const getProg = (p) => {
        const comp = p.nodes ? p.nodes.filter(s => s.status === 'completed').length : 0;
        const tot = p.nodes?.length || 1;
        return comp / tot;
      };
      return getProg(b) - getProg(a);
    }
    return 0;
  });

  const activeOrPaused = filteredPaths.filter(p => p.status === 'active' || p.status === 'paused');
  const archivedOrCompleted = filteredPaths.filter(p => p.status === 'archived' || p.status === 'completed');

  const PathCard = ({ path }) => {
    const isExpanded = expandedId === path.id;
    const isActive = activePathId === path.id && path.status === 'active';
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    const completedSkills = path.nodes ? path.nodes.filter(s => s.status === 'completed').length : 0;
    const totalSkills = path.nodes?.length || 0;
    const progress = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100);

    const nextSkill = path.nodes?.find(n => n.status !== 'completed' && n.status !== 'skipped');
    
    const streak = calculateStreak(path.nodes);
    const totalXP = path.nodes ? path.nodes.reduce((acc, n) => acc + (n.masteryScore || 0) * (n.estimatedHours || 2), 0) : 0;
    const level = Math.max(1, Math.floor(totalXP / 500));

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-2xl shadow-sm border ${isActive ? 'border-violet-400 ring-2 ring-violet-400/20' : 'border-slate-200'} mb-4 overflow-hidden transition-all`}
      >
        {/* Header Summary */}
        <div 
          className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : path.id)}
        >
          {/* Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-slate-100" strokeWidth="10" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-violet-600"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 282.7" }}
                animate={{ strokeDasharray: `${progress * 2.827} 282.7` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-slate-900">{progress}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                {path.targetRole ? path.targetRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Learning Path'}
              </h3>
              {isActive && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200">Active</span>}
              {path.status === 'paused' && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-200">Paused</span>}
              {path.status === 'completed' && <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-bold border border-violet-200">Completed</span>}
              {path.status === 'archived' && <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold border border-slate-200">Archived</span>}
              
              {streak > 0 && (
                <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold border border-orange-200">
                  <Flame size={12} className="fill-orange-500" /> {streak} Day Streak
                </span>
              )}
              {level > 1 && (
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold border border-yellow-200">
                  <Star size={12} className="fill-yellow-500" /> Lvl {level}
                </span>
              )}
            </div>
            
            <p className="text-sm text-slate-500 flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 size={14}/> {completedSkills}/{totalSkills} Skills</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {path.totalTimeMinutes || 0} mins</span>
              <span className="flex items-center gap-1">Mode: {path.contentMode === 'mentor' ? 'Mentor' : 'Open Source'}</span>
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

            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }} 
              className="p-1.5 text-slate-400"
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 rounded-b-2xl flex flex-col gap-8">
                
                {/* Top Row: Details & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase mb-1">Started On</span>
                      <span className="font-bold text-slate-900">{new Date(path.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase mb-1">Target Deadline</span>
                      <span className="font-bold text-slate-900">{path.deadlineWeeks ? `${path.deadlineWeeks} weeks` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase mb-1">Weekly Commitment</span>
                      <span className="font-bold text-slate-900">{path.hoursPerWeek ? `${path.hoursPerWeek} hrs/wk` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs font-bold uppercase mb-1">Known Skills</span>
                      <span className="font-bold text-slate-900 max-w-[150px] truncate block">{path.knownSkills && path.knownSkills.length > 0 ? path.knownSkills.join(', ') : 'None'}</span>
                    </div>
                  </div>
                  
                  {isActive && (
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/student/navigator/dashboard')}
                      className="w-full md:w-auto px-6 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-sm"
                    >
                      Go to Dashboard →
                    </motion.button>
                  )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Skills List */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider bg-violet-50 px-2 py-1 rounded">Up Next</span>
                      </div>
                      {nextSkill ? (
                        <p className="font-bold text-slate-900 text-lg">{nextSkill.label || nextSkill.skillId}</p>
                      ) : (
                        <p className="text-sm text-slate-500 font-medium">No pending skills.</p>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800">All Path Skills</h4>
                      </div>
                      <div className="p-2 space-y-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                        {path.nodes?.map((skill, idx) => {
                          const isVerified = skill.status === 'completed';
                          const isGap = skill.status === 'gap';
                          const isSelected = selectedSkillId === skill.skillId;
                          return (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedSkillId(skill.skillId)}
                              className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors cursor-pointer group ${
                                isSelected ? 'bg-violet-50 border border-violet-200 shadow-xs' : 'bg-transparent border border-transparent hover:bg-slate-50'
                              }`}
                            >
                              <span className={`font-bold transition-colors truncate pr-2 ${
                                isSelected ? 'text-violet-700' : isVerified ? 'text-green-700 group-hover:text-green-800' : isGap ? 'text-amber-600 group-hover:text-amber-700' : 'text-slate-700 group-hover:text-violet-600'
                              }`}>
                                {skill.label || skill.skillId}
                              </span>
                              {skill.masteryScore !== undefined && (
                                <span className={`text-xs font-bold shrink-0 ${isSelected ? 'text-violet-600' : 'text-slate-400'}`}>{skill.masteryScore}%</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Visualizations */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-center min-h-[260px]">
                      <SkillRadarChart path={path} width={240} height={240} activeSkillId={selectedSkillId} />
                    </div>
                    <LearningVelocityChart path={path} />
                  </div>

                  {/* Right Column: Consistency & Notes & Milestones */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <MilestonesPanel path={path} />
                    <LearningCalendar path={path} />
                    <SkillNotes path={path} externalActiveSkillId={selectedSkillId} />
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Learning Paths</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your personalized AI Navigator journeys.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search paths..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-hidden focus:ring-2 focus:ring-violet-500 flex-1 md:w-64 transition-all"
            />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-hidden focus:ring-2 focus:ring-violet-500 transition-all font-medium text-slate-700"
            >
              <option value="recent">Recent</option>
              <option value="progress">Progress</option>
            </select>
            <button 
              onClick={() => navigate('/student/navigator')}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all"
            >
              <Compass size={18} /> New Path
            </button>
          </div>
        </div>

        {state.isLoadingPaths ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your paths...</p>
            </div>
          </div>
        ) : paths.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <Compass size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No paths found</h3>
            <p className="text-slate-500 mb-6 font-medium">Start a new personalized learning journey.</p>
            <button 
              onClick={() => navigate('/student/navigator')}
              className="px-6 py-2.5 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-md hover:shadow-violet-500/30 transition-all"
            >
              Create Your First Path
            </button>
          </motion.div>
        ) : (
          <AnimatePresence>
            {activeOrPaused.length > 0 && (
              <motion.div layout className="mb-10">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Active & Paused</h2>
                <AnimatePresence>
                  {activeOrPaused.map((path, idx) => (
                    <PathCard key={path.id} path={path} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {archivedOrCompleted.length > 0 && (
              <motion.div layout>
                <h2 className="text-lg font-bold text-slate-500 mb-4">Archived & Completed</h2>
                <AnimatePresence>
                  {archivedOrCompleted.map((path, idx) => (
                    <PathCard key={path.id} path={path} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {filteredPaths.length === 0 && searchQuery && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <p className="text-slate-500">No paths match your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default MyPaths;
