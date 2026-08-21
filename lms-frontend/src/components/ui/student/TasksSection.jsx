import { CheckCircle2 } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

const TasksSection = ({ tasks, onTaskClick, onViewAll }) => {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 size={20} className="text-violet-600" />
        <h2 className="text-xl font-bold text-slate-900">Upcoming Tasks</h2>
      </div>

      {tasks.length > 0 ? (
        <>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                index={index}
                onClick={() => onTaskClick(task.courseId)}
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            fullWidth 
            className="mt-4"
            onClick={onViewAll}
          >
            View All Tasks
          </Button>
        </>
      ) : (
        <EmptyState
          icon={CheckCircle2}
          title="No Tasks"
          description="Complete your courses to track your progress here."
        />
      )}
    </Card>
  );
};

export default TasksSection;
