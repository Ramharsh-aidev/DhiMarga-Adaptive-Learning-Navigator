import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import FlipText from '../ui/FlipText';
import SocialFlipButton from '../ui/SocialFlipButton';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Courses', href: '#' },
      { name: 'Become a Mentor', href: '#' },
      { name: 'Student Success', href: '#' },
      { name: 'Certifications', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press Kit', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'System Status', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Licensing', href: '#' },
    ],
  };

  return (
    <footer id="about" className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        
        {/* Animated Banner Area */}
        <div className="flex flex-col items-center justify-center mb-16 text-center space-y-6">
          <div className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white flex justify-center">
             <FlipText duration={3} delay={0.1} separator="">
                DhiMārga
             </FlipText>
          </div>
          <p className="text-slate-400 max-w-lg text-lg">
             Empowering the next generation of developers through hands-on learning, expert mentorship, and real-world projects.
          </p>
          <div className="pt-6">
             <SocialFlipButton />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16 border-t border-slate-800 pt-16">
          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links & Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-4 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 transition-colors inline-block hover:translate-x-1 transform duration-300 font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <h4 className="text-white font-bold mb-4 tracking-wide uppercase text-sm">Stay Updated</h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-violet-500 text-white placeholder-slate-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-linear-to-r from-violet-600 to-pink-600 text-white rounded-xl font-bold shadow-md"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md overflow-hidden bg-white">
              <img src="/logo.jpg" alt="DhiMarga Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">DhiMārga</span>
          </div>
          
          <p className="text-slate-500 text-sm font-medium text-center md:text-left">
            &copy; {currentYear} DhiMārga. Built with{' '}
            <Heart className="inline w-4 h-4 text-pink-500 mx-1" fill="currentColor" /> by{' '}
            <span className="text-violet-400 font-bold">Ramharsh</span>
          </p>
          
          <div className="flex items-center space-x-6">
            <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">Adaptive Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
