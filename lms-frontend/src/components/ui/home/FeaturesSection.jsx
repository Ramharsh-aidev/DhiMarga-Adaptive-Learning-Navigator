import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BackgroundBlobs from './BackgroundBlobs';
import { BrainCircuit, Video, TrendingUp, Award, Users, Map, Zap, Globe } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: 'DhiMārga Navigator',
      description: 'AI-driven adaptive learning paths that adjust in real-time based on your understanding and skill gaps.',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Map,
      title: 'Knowledge Graphs',
      description: 'Visualize your entire learning journey with interactive mind maps showing mastery and upcoming topics.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Real-time Remediation',
      description: 'Get instant, targeted quizzes and explanations the moment the system detects a learning blockage.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: TrendingUp,
      title: 'Deep Analytics',
      description: 'Monitor your cognitive load, learning consistency, and skill growth with detailed radar charts.',
      color: 'from-violet-600 to-indigo-600',
    },
    {
      icon: Video,
      title: 'Curated Resources',
      description: 'Learn through high-quality video content and open-source articles tailored to your current focus.',
      color: 'from-indigo-500 to-violet-500',
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Learn from industry professionals with years of software development experience.',
      color: 'from-purple-600 to-fuchsia-600',
    },
    {
      icon: Award,
      title: 'Milestone Tracking',
      description: 'Set custom deadlines and earn industry-recognized certificates as you clear your learning debts.',
      color: 'from-fuchsia-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with developers worldwide and collaborate on real-world projects.',
      color: 'from-rose-500 to-orange-500',
    },
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <section id="features" className="py-24 lg:py-32 bg-linear-to-b from-violet-50/50 to-pink-50/50 relative overflow-hidden">
      <BackgroundBlobs />
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10" ref={containerRef}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-bold mb-4 border border-violet-200 uppercase tracking-wider">
            Intelligent Platform
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Everything You Need to{' '}
            <span className="bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Excel Faster
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Our platform provides all the tools, AI resources, and personalized support you need 
            for an exceptional adaptive learning experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 border border-slate-200 hover:border-violet-300 overflow-hidden"
            >
              {/* Hover Glow Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
