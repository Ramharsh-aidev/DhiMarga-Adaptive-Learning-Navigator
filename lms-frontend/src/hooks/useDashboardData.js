import { useState, useEffect, useCallback, useRef } from 'react';
import { getMyProgress } from '../services/progressService';
import { getNavigatorState } from '../services/navigatorService';
import { calculateStats, getRecentCourses, getUpcomingTasks } from '../utils/dashboardHelpers';

/**
 * Unified dashboard data hook.
 * Fetches both course progress (backend) and navigator state (backend) in parallel
 * and merges them into a single data object.
 *
 * Auto-refreshes:
 *  - When the browser window regains focus
 *  - When the 'lms_progress_dirty' localStorage flag is set (by ChapterView after completing a chapter)
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
    weakSkills: []
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
        getNavigatorState()
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

      // Process navigator state
      if (navigatorResponse.status === 'fulfilled' && navigatorResponse.value?.stateJson) {
        try {
          const parsed = JSON.parse(navigatorResponse.value.stateJson);
          const paths = parsed.paths || [];

          let skillsMastered = 0;
          let skillsInProgress = 0;
          const weakSkillLabels = [];

          paths.forEach(path => {
            const learnerState = path.learnerState || {};
            const currentPath = path.currentPath || [];

            currentPath.forEach(node => {
              const ls = learnerState[node.skillId];
              if (ls?.status === 'verified') skillsMastered++;
              else if (ls?.status === 'gap') weakSkillLabels.push(node.label);
              else if (node.status === 'current') skillsInProgress++;
            });
          });

          setNavigatorStats({
            activePaths: paths.filter(p => p.status === 'active').length,
            skillsMastered,
            skillsInProgress,
            weakSkills: weakSkillLabels
          });
        } catch (parseErr) {
          console.warn('[Dashboard] Could not parse navigator state:', parseErr.message);
        }
      }

      setLastUpdatedAt(new Date());
      // Clear dirty flag
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
