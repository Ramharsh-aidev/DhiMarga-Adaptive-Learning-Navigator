import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';

const ChapterNavigation = ({ prevChapter, nextChapter, canGoNext, onPrev, onNext }) => {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {prevChapter ? (
            <Button
              variant="outline"
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              onClick={onPrev}
            >
              Previous: {prevChapter.title}
            </Button>
          ) : (
            <div className="text-sm text-gray-500">First chapter</div>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {nextChapter ? (
            canGoNext ? (
              <Button
                variant="primary"
                rightIcon={<ChevronRight className="w-5 h-5" />}
                onClick={onNext}
              >
                Next: {nextChapter.title}
              </Button>
            ) : (
              <Button
                variant="secondary"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled
                title="Complete current chapter to unlock"
              >
                Next: {nextChapter.title}
              </Button>
            )
          ) : (
            <div className="text-sm text-green-600 font-medium">
              🎉 Last chapter!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChapterNavigation;
