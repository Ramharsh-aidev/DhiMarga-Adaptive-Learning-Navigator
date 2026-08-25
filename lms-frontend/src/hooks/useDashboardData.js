import { useState, useEffect, useCallback, useRef } from 'react';
import { getMyProgress } from '../services/progressService';
import { getDashboardSummary } from '../services/navigatorService';
import { calculateStats, getRecentCourses, getUpcomingTasks } from '../utils/dashboardHelpers';

/**
 * Unified dashboard data hook.
 * Fetches both course progress (backend) and navigator state (backend) in parallel
 * and merges them into a single data object.
 */
const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseStats, setCourseStats] = useState({
    enrolledCourses: 0,
    overallProgress: 0,
    certificates: 0,
    learningHours: 0
  });
  const [navigatorStats, setNavigatorStats] = useState({
    activePaths: 0,
    skillsMastered: 0,
    skillsInProgress: 0,
    weakSkills: [],
    nextSkill: null,
    progressPercentage: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchAll = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      // Fetch both sources in parallel
      const [progressResponse, navigatorResponse] = await Promise.allSettled([
        getMyProgress(),
        getDashboardSummary()
      ]);

      // Process course progress
      if (progressResponse.status === 'fulfilled') {
        const progressData = progressResponse.value || [];
        setCourseStats(calculateStats(progressData));
        setRecentCourses(getRecentCourses(progressData));
        setUpcomingTasks(getUpcomingTasks(progressData));
      } else {
        console.warn('[Dashboard] Could not load course progress:', progressResponse.reason?.message);
      }

      // Process navigator state via relational API summary
      if (navigatorResponse.status === 'fulfilled' && navigatorResponse.value) {
        const dData = navigatorResponse.value;
        setNavigatorStats({
          activePaths: dData.activePaths || 0,
          skillsMastered: dData.completedSkills || 0,
          skillsInProgress: (dData.totalSkills || 0) - (dData.completedSkills || 0),
          weakSkills: (dData.weakSkills || []).map(w => w.label),
          nextSkill: dData.nextSkill,
          progressPercentage: dData.progressPercentage || 0,
          activePathName: dData.activePathName,
          totalTimeMinutes: dData.totalTimeMinutes || 0
        });
      } else {
        console.warn('[Dashboard] Could not load navigator summary:', navigatorResponse.reason?.message);
      }

      setLastUpdatedAt(new Date());
      localStorage.removeItem('lms_progress_dirty');
    } catch (err) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      const dirtyFlag = localStorage.getItem('lms_progress_dirty');
      if (dirtyFlag) fetchAll();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchAll]);

  return {
    courseStats,
    navigatorStats,
    recentCourses,
    upcomingTasks,
    loading,
    error,
    lastUpdatedAt,
    refresh: fetchAll
  };
};

export default useDashboardData;
