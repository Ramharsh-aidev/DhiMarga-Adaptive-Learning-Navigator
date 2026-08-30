// Dashboard utility functions

export const formatLastAccessed = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export const getThumbnail = (title) => {
  if (!title) return '📚';
  const emojis = {
    'react': '⚛️',
    'node': '🟢',
    'javascript': '💛',
    'typescript': '💙',
    'java': '☕',
    'python': '🐍',
    'spring': '🍃',
    'database': '🗄️',
    'api': '🔌'
  };
  const key = Object.keys(emojis).find(k => title.toLowerCase().includes(k));
  return emojis[key] || '📚';
};

export const transformProgressData = (progressData = []) => {
  return progressData.map(p => ({
    id: p.courseId,
    title: p.courseTitle,
    totalChapters: p.totalChapters,
    completedChapters: p.completedChapters,
    progress: p.completionPercentage,
    status: p.completionPercentage === 100 ? 'completed' 
          : p.completionPercentage > 0 ? 'in_progress' 
          : 'not_started'
  }));
};

export const getRecentCourses = (progressData) => {
  return progressData
    .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt))
    .slice(0, 3)
    .map(p => ({
      id: p.courseId,
      title: p.courseTitle,
      progress: p.completionPercentage,
      chaptersCompleted: p.completedChapters,
      totalChapters: p.totalChapters,
      lastAccessed: formatLastAccessed(p.lastActivityAt),
      thumbnail: getThumbnail(p.courseTitle)
    }));
};

export const getUpcomingTasks = (progressData) => {
  return progressData
    .filter(p => p.completionPercentage > 0 && p.completionPercentage < 100)
    .slice(0, 4)
    .map((p, index) => {
      const nextChapter = p.completedChapters + 1;
      return {
        id: `task-${p.courseId}`,
        title: `Continue ${p.courseTitle} - Chapter ${nextChapter}`,
        dueDate: 'Soon',
        priority: index < 2 ? 'high' : 'medium',
        courseId: p.courseId
      };
    });
};

export const calculateStats = (progressData) => {
  const totalCourses = progressData?.length || 0;
  const completedChapters = progressData?.reduce((sum, p) => sum + p.completedChapters, 0) || 0;
  const totalChapters = progressData?.reduce((sum, p) => sum + p.totalChapters, 0) || 0;
  const avgProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const certificates = progressData?.filter(p => p.completionPercentage === 100).length || 0;
  const hours = Math.round(completedChapters * 0.5); // Estimate 30 min per chapter

  return {
    enrolledCourses: totalCourses,
    overallProgress: avgProgress,
    certificates,
    learningHours: hours
  };
};
