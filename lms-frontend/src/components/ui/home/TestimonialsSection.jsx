import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Full-Stack Developer',
      company: 'Tech Giants Inc.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      content: 'DhiMārgatransformed my development approach. The katas and mentor guidance helped me land my dream job with a 40% salary increase!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'Software Engineer',
      company: 'Startup Hub',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      content: 'The hands-on TDD practice and real-world projects gave me confidence. I went from intern to full-time engineer in just 6 months.',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'Backend Developer',
      company: 'Cloud Solutions Ltd.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      content: 'Best investment in my career! The certification and practical skills opened doors to opportunities I never thought possible.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-linear-to-b from-indigo-50/25 via-white/35 to-purple-50/30 relative overflow-hidden backdrop-blur-sm">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-indigo-50 to-transparent" />

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
            TESTIMONIALS
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Success Stories from{' '}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how DhiMārgahas helped developers level up their careers
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-indigo-100/50 h-full relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                  <motion.img
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-100 to-purple-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-indigo-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-4">Want to share your success story?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
