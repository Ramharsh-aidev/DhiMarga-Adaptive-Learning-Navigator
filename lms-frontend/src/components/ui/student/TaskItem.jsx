import { motion } from 'framer-motion';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

const TaskItem = ({ task, index, onClick }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.05 }}
    >
      <Card hover className="group cursor-pointer" onClick={onClick}>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {task.title}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getPriorityVariant(task.priority)} size="sm">
                {task.priority}
              </Badge>
              <span className="text-xs text-gray-500">{task.dueDate}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskItem;
