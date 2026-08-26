import React from 'react';
import { motion } from 'motion/react';
import { Play, FastForward, Video, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NextActionCard = ({ currentNode, isGap, onStart, onSkip }) => {
  if (!currentNode) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-slate-200 rounded-3xl p-1 overflow-hidden shadow-xl shadow-violet-500/5"
    >
      <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-[22px] p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative background vectors */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 -mb-20 w-48 h-48 rounded-full bg-violet-200 opacity-20 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-8">
          
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-sm border ${
                isGap ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-violet-600 border-violet-100'
              }`}>
                {isGap ? 'Recovery Mission' : 'Mastery Mission'}
              </span>
              <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                <ClockIcon /> ~{Math.round(currentNode.estimatedHours || 3)}h Focus
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              {currentNode.nodeRef?.label || currentNode.skillId}
            </h2>
            
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-6">
              {currentNode.selectedResource?.title || 'Master this topic to continue advancing on your personalized learning journey. Ready to dive in?'}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              {currentNode.selectedResource?.url && (
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={currentNode.selectedResource.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-200 py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video size={18} /> Watch Lecture
                </motion.a>
              )}
              {currentNode.selectedResource?.docsUrl && (
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={currentNode.selectedResource.docsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-200 py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText size={18} /> Read Docs
                </motion.a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 w-full md:w-auto mt-4 md:mt-0 bg-white/60 p-6 rounded-2xl border border-white backdrop-blur-md shadow-sm">
            <p className="text-sm text-slate-600 font-bold text-center mb-1">
              Ready for the test?
            </p>
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-violet-400 blur-md pointer-events-none"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="relative w-20 h-20 bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.5)] transition-shadow shrink-0 group z-10"
                title="Start Assessment"
              >
                <Play size={32} className="ml-2 group-hover:text-violet-100 transition-colors" fill="currentColor" />
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default NextActionCard;
