import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { USER_ROLES } from '../../../utils/constants';
import FlipText from '../FlipText';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Parallax Scroll logic
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 150]);
  const y2 = useTransform(scrollY, [0, 800], [0, -100]);
  const fadeOut = useTransform(scrollY, [0, 600], [1, 0]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case USER_ROLES.ADMIN: return '/admin/dashboard';
      case USER_ROLES.MENTOR: return '/mentor/dashboard';
      case USER_ROLES.STUDENT: return '/student/dashboard';
      default: return '/login';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-13 pb-24 bg-slate-50 overflow-hidden">
      
      {/* Background Soft Glow to match the light theme */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Mobile Background Video (Hidden on Desktop) */}
      <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none z-0 opacity-20">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/vision-poster2.png"
          className="absolute min-w-full min-h-full object-cover mix-blend-multiply scale-110"
        >
          <source src="/vision1.webm" type="video/webm" />
        </video>
      </div>

      <motion.div 
        style={{ y: y1, opacity: fadeOut }}
        className="container mx-auto px-4 lg:px-8 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Content Area */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col items-start text-left pt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight"
            >
              Master New Skills <br />
              <span className="flex items-center gap-4 mt-2">
                <span className="text-slate-900">With </span>
                <FlipText duration={3} delay={0.1} separator="" className="text-pink-600 drop-shadow-sm pb-2">
                  AI.
                </FlipText>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 mb-10 font-medium max-w-md leading-relaxed"
            >
              The intelligent navigator that builds a personalized path just for you. Identify knowledge gaps, practice with AI, and achieve mastery faster.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 mb-16"
            >
              {isAuthenticated ? (
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(getDashboardLink())}
                  className="px-8 py-4 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-xl transition-all duration-300"
                >
                  Go to Dashboard
                </motion.button>
              ) : (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="px-8 py-4 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-xl transition-all duration-300"
                  >
                    Start Learning Free
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 text-slate-700 bg-white border border-slate-200 shadow-sm font-bold text-lg rounded-xl hover:text-slate-900 hover:border-violet-300 transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Video / 3D Area (Hidden on Mobile) */}
          <motion.div 
            className="hidden lg:flex w-full lg:w-1/2 relative justify-center items-center mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[550px] aspect-[16/12] flex items-center justify-center mx-auto">
              
              {/* Oval Mask Container */}
              <div className="absolute inset-0 rounded-[110px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white/60 bg-white/20">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  poster="/vision-poster2.png"
                  className="w-full h-full object-cover mix-blend-multiply scale-105"
                >
                  <source src="/vision1.webm" type="video/webm" />
                </video>
              </div>

              {/* Floating Pills (pushed outside) */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -right-16 xl:-right-24 bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 rounded-2xl px-5 py-3 flex flex-col gap-1.5 text-xs font-bold text-slate-500 z-20"
              >
                <div className="flex items-center justify-between gap-4">
                  Difficulty <span className="text-amber-500 text-[10px]">●</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  Job Type <span className="text-emerald-500 text-[10px]">●</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 -left-15 xl:-left-45 bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 rounded-full px-5 py-3 flex items-center gap-3 text-xs font-bold text-slate-500 z-20"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
                </div>
                Customized Experience
              </motion.div>
              
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-12 -right-8 xl:-right-16 bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 rounded-full px-5 py-3 text-xs font-bold text-slate-700 z-20"
              >
                AI Analyzing
              </motion.div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
