import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/35">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar - Only show if showSidebar is true */}
        {showSidebar && <Sidebar />}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
