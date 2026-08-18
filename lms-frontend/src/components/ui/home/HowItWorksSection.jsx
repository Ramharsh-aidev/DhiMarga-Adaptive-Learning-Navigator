import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Award, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up for free in seconds. Choose your learning path and set your goals as you begin your DhiMārga journey.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      icon: BookOpen,
      title: 'Learn & Practice',
      description: 'Access video tutorials, and hands-on projects. Get assigned courses by mentors and practice TDD principles.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: Award,
      title: 'Earn Recognition',
      description: 'Complete courses, pass assessments, and earn official certificates that prove your TDD expertise to employers.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-linear-to-br from-purple-50/35 via-indigo-50/30 to-pink-50/35 relative overflow-hidden backdrop-blur-sm">
      {/* Background Decorations - Subtle */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold mb-4 shadow-sm">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Start Your DhiMārga Journey in{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From beginner to expert, our structured learning path guides you every step of the way
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-16 last:mb-0"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}>
                {/* Icon Card */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="shrink-0"
                >
                  <div className="relative">
                    <div className={`w-32 h-32 bg-linear-to-br ${step.color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                      <step.icon className="w-16 h-16 text-white" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-indigo-50">
                      <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 mb-4"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 leading-relaxed"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="hidden lg:block absolute left-1/2 top-32 w-0.5 h-16 bg-linear-to-b from-indigo-300 to-purple-300 transform -translate-x-1/2"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Success Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-gray-700 font-medium">Join 10,000+ students already learning!</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
