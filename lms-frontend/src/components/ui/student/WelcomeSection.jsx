import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import Button from '../../common/Button';

const WelcomeSection = ({ userName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Target size={20} />}
          className="md:shrink-0"
        >
          Set Goals
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
