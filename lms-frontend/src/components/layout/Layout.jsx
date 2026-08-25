import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden text-slate-800 flex flex-col">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-200/40 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-100/50 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100/40 blur-3xl pointer-events-none z-0" />

      {/* Main Navbar for non-sidebar pages */}
      {!showSidebar && <Navbar onMenuClick={() => setIsSidebarOpen(true)} />}

      {/* Mobile Top Bar for Dashboard Pages */}
      {showSidebar && (
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-extrabold bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                DhiMārga
              </h1>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
