// Filter and sort courses based on user preferences
export const filterAndSortCourses = (courses, filters) => {
  let filtered = [...courses];

  // Filter by search
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(course =>
      course.courseTitle.toLowerCase().includes(search) ||
      course.mentorName.toLowerCase().includes(search)
    );
  }

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter(course => {
      if (filters.status === 'not-started') return course.completionPercentage === 0;
      if (filters.status === 'in-progress') return course.completionPercentage > 0 && course.completionPercentage < 100;
      if (filters.status === 'completed') return course.completionPercentage === 100;
      return true;
    });
  }

  // Sort
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'recent':
        return new Date(b.lastActivityAt) - new Date(a.lastActivityAt);
      case 'progress':
        return b.completionPercentage - a.completionPercentage;
      case 'title':
        return a.courseTitle.localeCompare(b.courseTitle);
      case 'assigned':
        return new Date(b.assignedAt) - new Date(a.assignedAt);
      default:
        return 0;
    }
  });

  return filtered;
};

// Determine which chapters are locked based on completion
export const getChaptersWithLockStatus = (chapters) => {
  if (!chapters || chapters.length === 0) return [];

  const firstIncompleteIndex = chapters.findIndex(ch => !ch.isCompleted);

  return chapters.map((chapter, index) => ({
    ...chapter,
    isLocked: firstIncompleteIndex !== -1 && index > firstIncompleteIndex
  }));
};

// Merge chapter details with progress status
export const mergeChapterProgress = (chaptersData, progressData, chapterId) => {
  const chapter = chaptersData.find(ch => ch.id === chapterId);
  if (!chapter) return null;

  const progressChapter = progressData.chapters.find(ch => ch.chapterId === chapterId);
  
  return {
    ...chapter,
    completed: progressChapter?.isCompleted || false,
    completedAt: progressChapter?.completedAt || null
  };
};
