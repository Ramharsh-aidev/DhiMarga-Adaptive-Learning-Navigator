import { BookOpen } from 'lucide-react';
import Card from '../../common/Card';
import ChapterItem from './ChapterItem';
import EmptyState from './EmptyState';

const ChapterList = ({ chapters, title, subtitle, onChapterClick, onBackClick }) => {
  if (chapters.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={BookOpen}
          title="No Chapters Yet"
          description="This course doesn't have any chapters yet. Check back later."
          actionLabel="Back to Courses"
          onAction={onBackClick}
        />
      </Card>
    );
  }

  return (
    <>
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.chapterId}
            chapter={chapter}
            isLocked={chapter.isLocked}
            onClick={() => onChapterClick(chapter.chapterId)}
          />
        ))}
      </div>
    </>
  );
};

export default ChapterList;
