import React from 'react';
import { motion } from 'framer-motion';
import BackgroundBlobs from './BackgroundBlobs';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Full-Stack Developer',
      company: 'Tech Giants Inc.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      content: 'DhiMārga transformed my development approach. The adaptive pathways helped me fill knowledge gaps I didn’t even know I had!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'Software Engineer',
      company: 'Startup Hub',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      content: 'The real-time remediation and targeted quizzes kept me on track. I learned complex architectural patterns in half the time.',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'Backend Developer',
      company: 'Cloud Solutions Ltd.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      content: 'Best investment in my career! The AI mentor gave me exactly the feedback I needed when I was stuck on tricky concepts.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-linear-to-b from-violet-50/50 to-pink-50/50 relative overflow-hidden">
      <BackgroundBlobs />
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-linear-to-b from-violet-100/30 to-pink-100/30 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-bold mb-4 border border-violet-200">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Success Stories from{' '}
            <span className="bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            See how the DhiMārga adaptive learning engine has accelerated developers' careers.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 h-full relative group transition-all duration-300"
              >
                {/* Subtle gradient hover */}
                <div className="absolute inset-0 bg-linear-to-br from-violet-50 to-pink-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none -z-10" />

                {/* Quote Icon */}
                <div className="absolute -top-6 -left-6 w-14 h-14 bg-linear-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-6 border-t border-slate-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-200 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full bg-slate-100 relative z-10 border-2 border-white"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mt-1">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <p className="text-lg text-slate-600 mb-6 font-medium">Want to share your success story?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-slate-800 border border-slate-200 hover:border-violet-300 hover:text-violet-700 hover:shadow-lg rounded-xl font-bold shadow-sm transition-all"
          >
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
