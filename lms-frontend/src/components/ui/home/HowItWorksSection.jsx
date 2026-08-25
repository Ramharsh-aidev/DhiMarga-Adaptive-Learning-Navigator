import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BackgroundBlobs from './BackgroundBlobs';
import { UserPlus, Compass, Trophy, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Initialize Profile',
      description: 'Sign up and take a quick AI diagnostic. DhiMārga builds an initial capability graph mapping your current strengths and weaknesses.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      number: '02',
      icon: Compass,
      title: 'Follow the Navigator',
      description: 'Start learning along your personalized path. If you get stuck, the engine dynamically reroutes you to prerequisite concepts to clear blockages.',
      color: 'from-violet-500 to-purple-500',
    },
    {
      number: '03',
      icon: Trophy,
      title: 'Achieve Mastery',
      description: 'Turn all nodes green on your knowledge graph. Pass final assessments and earn verified credentials.',
      color: 'from-fuchsia-500 to-pink-500',
    },
  ];

  const containerRef = useRef(null);
  
  // Scroll-linked timeline progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-linear-to-b from-pink-50/50 to-violet-50/50 relative overflow-hidden" ref={containerRef}>
      <BackgroundBlobs />
      {/* Background Decorations */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-50 rounded-full mix-blend-multiply filter blur-[80px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-pink-50 rounded-full mix-blend-multiply filter blur-[80px] -z-10" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-bold mb-4 border border-violet-100">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            The Smartest Way to{' '}
            <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Learn TDD
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            From beginner to expert, the DhiMārga adaptive engine guides you every step of the way.
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="max-w-5xl mx-auto relative">
          
          {/* Animated Vertical Line */}
          <div className="absolute left-[50%] top-10 bottom-10 w-1 bg-slate-100 hidden lg:block transform -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-linear-to-b from-violet-500 via-purple-500 to-pink-500" 
              style={{ height: lineHeight }}
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative mb-20 last:mb-0"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-20`}>
                
                {/* Icon Card */}
                <div className={`w-full lg:w-1/2 flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 3 : -3 }}
                    className="relative group cursor-default"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-violet-200 to-pink-200 rounded-[2rem] transform rotate-3 opacity-50 group-hover:rotate-6 transition-transform duration-300" />
                    <div className={`relative w-40 h-40 bg-linear-to-br ${step.color} rounded-[2rem] flex items-center justify-center shadow-xl z-10`}>
                      <step.icon className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-14 h-14 bg-linear-to-b from-pink-50/50 to-violet-50/50 rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-50 z-20 transform rotate-12">
                      <span className="text-xl font-black bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`w-full lg:w-1/2 text-center ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
          className="mt-20 text-center relative z-10"
        >
          <div className="inline-flex items-center space-x-3 bg-linear-to-b from-pink-50/50 to-violet-50/50 rounded-2xl px-6 py-4 shadow-xl border border-slate-100 hover:border-violet-200 transition-colors cursor-default">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-slate-800 font-bold text-lg tracking-tight">Join the next generation of engineers!</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
