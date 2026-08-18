import { Play, Lock, CheckCircle2 } from 'lucide-react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

const ChapterItem = ({ chapter, isLocked, onClick }) => {
  const { title, description, orderIndex, completed } = chapter;

  const getStatusBadge = () => {
    if (completed) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    }
    if (isLocked) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Locked
        </Badge>
      );
    }
    return <Badge variant="warning">In Progress</Badge>;
  };

  return (
    <Card
      padding="md"
      className={`transition-all ${
        isLocked ? 'opacity-60' : 'hover:shadow-md cursor-pointer'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-indigo-600">
              {orderIndex}
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {!isLocked && (
            <Button
              variant={completed ? 'outline' : 'primary'}
              size="sm"
              leftIcon={completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              onClick={onClick}
            >
              {completed ? 'Rewatch' : 'Watch'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChapterItem;