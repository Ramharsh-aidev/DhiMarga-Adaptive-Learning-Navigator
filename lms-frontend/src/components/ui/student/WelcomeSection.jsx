import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';

const WelcomeSection = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-0"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-slate-600 font-medium">Ready to continue your learning journey?</p>
        </div>
        <div className="ml-4 flex items-center">
          <Button
            variant="outline"
            leftIcon={<Target size={20} />}
            onClick={() => navigate('/student/careers')}
            className="md:shrink-0 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Set Goals
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
