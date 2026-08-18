import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/ui/home/HeroSection';
import FeaturesSection from '../components/ui/home/FeaturesSection';
import HowItWorksSection from '../components/ui/home/HowItWorksSection';
import TestimonialsSection from '../components/ui/home/TestimonialsSection';
import CTASection from '../components/ui/home/CTASection';
import Footer from '../components/layout/Footer';
import FloatingShapes from '../components/common/FloatingShapes';
import { PageLoader } from '../components/common/Spinner';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <PageLoader text="DhiMārga" delay={2000}>
      <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/35 relative overflow-hidden">
        <FloatingShapes />
        {/* Use Navbar if authenticated, otherwise use Header */}
        {isAuthenticated ? <Navbar /> : <Header />}
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Home;
