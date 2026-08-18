import { motion } from 'framer-motion';
import { Code, Video, TrendingUp, Award, Users, Shield, Zap, Globe } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code,
      title: 'DhiMārga',
      description: 'Practice Test-Driven Development with carefully crafted coding exercises and challenges.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Learn through high-quality video content with step-by-step explanations from experts.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your growth with detailed analytics and personalized learning insights.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn industry-recognized certificates to showcase your TDD expertise.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Learn from industry professionals with years of TDD and software development experience.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Secure Learning',
      description: 'Your data and progress are protected with enterprise-grade security measures.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Real-time Feedback',
      description: 'Get instant feedback on your code submissions and test implementations.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with developers worldwide and collaborate on projects.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-20 lg:py-32 bg-linear-to-b from-white/40 via-indigo-50/30 to-purple-50/25 relative overflow-hidden backdrop-blur-sm">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
            FEATURES
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Excel in TDD
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools, resources, and support you need 
            for an exceptional learning experience in Test-Driven Development.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-indigo-100/50 overflow-hidden"
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
