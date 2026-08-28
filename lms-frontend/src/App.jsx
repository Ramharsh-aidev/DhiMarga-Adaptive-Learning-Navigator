import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';
import PendingApprovalRoute from './components/common/PendingApprovalRoute';
import { USER_ROLES } from './utils/constants';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Spinner from './components/common/Spinner';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/MyCourses';
import CourseView from './pages/student/CourseView';
import ChapterView from './pages/student/ChapterView';
import Credentials from './pages/student/Credentials';
import StudentProfile from './pages/student/Profile';
import Progress from './pages/student/Progress';
import StudentSettings from './pages/student/Settings';

// Navigator Pages
import NavigatorGoal from './pages/student/navigator/NavigatorGoal';
import NavigatorPlan from './pages/student/navigator/NavigatorPlan';
import NavigatorDashboard from './pages/student/navigator/NavigatorDashboard';
import NavigatorMap from './pages/student/navigator/NavigatorMap';
import NavigatorRecovery from './pages/student/navigator/NavigatorRecovery';
import NavigatorAssessment from './pages/student/navigator/NavigatorAssessment';
import CareerExplorer from './pages/student/CareerExplorer';
import CareerDetail from './pages/student/CareerDetail';
import CareerCompare from './pages/student/CareerCompare';
import SocialHub from './pages/student/SocialHub';
import MyPaths from './pages/student/MyPaths';
import { NavigatorProvider } from './context/NavigatorContext';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorCourses from './pages/mentor/MentorCourses';
import CreateCourse from './pages/mentor/CreateCourse';
import EditCourse from './pages/mentor/EditCourse';
import ManageChapters from './pages/mentor/ManageChapters';
import AssignCourse from './pages/mentor/AssignCourse';
import PendingApproval from './pages/mentor/PendingApproval';
import MentorProfile from './pages/mentor/Profile';
import MentorSettings from './pages/mentor/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminAnalytics from './pages/admin/Analytics';
import AdminProfile from './pages/admin/Profile';
import AdminSettings from './pages/admin/Settings';

// Mentor Analytics
import MentorAnalytics from './pages/mentor/Analytics';
import CourseAnalytics from './pages/mentor/CourseAnalytics';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <NavigatorProvider>
              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/spinner-demo" element={<Spinner />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <CourseView />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/courses/:courseId/chapters/:chapterId"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <ChapterView />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/credentials"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <Credentials />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <Progress />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentSettings />
              </PrivateRoute>
            }
          />

          {/* Navigator Routes */}
          <Route
            path="/student/careers"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <CareerExplorer />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/social"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <SocialHub />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/careers/compare"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <CareerCompare />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/careers/:slug"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <CareerDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/paths"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <MyPaths />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorGoal />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator/plan"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorPlan />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator/dashboard"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator/map"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorMap />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator/recovery"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorRecovery />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/navigator/assess/:skillId"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <NavigatorAssessment />
              </PrivateRoute>
            }
          />

          {/* Mentor Routes */}
          {/* Pending Approval - Only for unapproved mentors */}
          <Route 
            path="/mentor/pending-approval" 
            element={
              <PendingApprovalRoute>
                <PendingApproval />
              </PendingApprovalRoute>
            } 
          />
          <Route
            path="/mentor/dashboard"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses/create"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses/:courseId/edit"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <EditCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses/:courseId/chapters"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <ManageChapters />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses/:courseId/assign"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <AssignCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/profile"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/analytics"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/courses/:courseId/analytics"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <CourseAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/settings"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorSettings />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminSettings />
              </PrivateRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
              </Routes>
            </NavigatorProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
