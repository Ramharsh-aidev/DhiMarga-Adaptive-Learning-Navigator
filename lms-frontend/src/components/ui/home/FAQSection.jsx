import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundBlobs from './BackgroundBlobs';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI create a personalized learning path?",
    answer: "Our engine continuously analyzes your quiz scores, code submissions, and learning pace. It dynamically adjusts the curriculum, prioritizing topics where you need more practice and accelerating through concepts you've mastered."
  },
  {
    question: "Is the platform suitable for beginners?",
    answer: "Absolutely! The adaptive nature of DhiMārga means it meets you exactly where you are. Beginners get foundational katas and extra hints, while advanced users get complex architectural challenges."
  },
  {
    question: "Does the AI support multiple programming languages?",
    answer: "Yes, our interactive coding environments and AI mentors currently support Python, Java, JavaScript, TypeScript, Go, and C++, with more being added regularly."
  },
  {
    question: "Can I integrate my progress with my university or employer?",
    answer: "Yes, DhiMārga offers verifiable credentials and progress exports that can be shared with instructors or integrated into partner ATS systems to showcase your verified skills."
  },
  {
    question: "What kind of analytics and insights do I get?",
    answer: "You get access to a comprehensive Skill Radar Chart, Learning Calendar, and Milestones Panel. These tools visualize your strengths, pinpoint exact knowledge gaps, and track your daily consistency."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-linear-to-b from-pink-50/50 to-violet-50/50">
      <BackgroundBlobs />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side - Title and 3D Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/3 flex flex-col justify-center text-center lg:text-left"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Got Questions?
            </h2>
            <p className="text-lg text-slate-600 mb-12 font-medium">
              Everything you need to know about using our AI adaptive learning platform effectively.
            </p>
            
            {/* 3D Question mark representation */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex justify-center"
            >
              <img 
                src="/FAQ-section-image.webp" 
                alt="FAQ 3D Question Mark" 
                className="w-full max-w-[300px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Accordion */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-2/3 max-w-3xl"
          >
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                
                return (
                  <motion.div 
                    key={index}
                    initial={false}
                    animate={{ backgroundColor: isOpen ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)' }}
                    className={`rounded-2xl border ${isOpen ? 'border-violet-300 shadow-md shadow-violet-500/10' : 'border-slate-200'} backdrop-blur-md overflow-hidden transition-all duration-300`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="font-bold text-slate-800 text-lg pr-8">{faq.question}</span>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-400'}`}>
                        {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
