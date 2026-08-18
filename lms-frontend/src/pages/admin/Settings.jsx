import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Save,
  AlertCircle,
  Database
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

const Settings = () => {
  const { showToast } = useToast();
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newUserRegistrations: true,
    mentorApprovals: true,
    systemAlerts: true,
    dailyReport: true
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoApproveMentors: false,
    requireEmailVerification: true,
    allowPublicRegistration: true,
    maintenanceMode: false
  });

  // Theme Settings
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // TODO: Integrate with backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Password changed successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } catch (error) {
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      // TODO: Integrate with backend API
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Notification preferences saved', 'success');
    } catch {
      showToast('Failed to save notification preferences', 'error');
    }
  };

  const handleSystemSettingsSave = async () => {
    try {
      // TODO: Integrate with backend API
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('System settings saved', 'success');
    } catch {
      showToast('Failed to save system settings', 'error');
    }
  };

  const handlePreferencesSave = async () => {
    try {
      // TODO: Integrate with backend API
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Preferences saved', 'success');
    } catch {
      showToast('Failed to save preferences', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">Manage system and account settings</p>
        </div>

        {/* Change Password */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              error={passwordErrors.currentPassword}
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              error={passwordErrors.newPassword}
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              error={passwordErrors.confirmPassword}
              placeholder="Confirm new password"
            />

            <Button
              type="submit"
              isLoading={isChangingPassword}
              className="w-full sm:w-auto"
            >
              <Save size={18} />
              Update Password
            </Button>
          </form>
        </Card>

        {/* System Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              <p className="text-sm text-gray-600">Configure platform-wide settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries({
              autoApproveMentors: 'Auto-approve Mentor Registrations',
              requireEmailVerification: 'Require Email Verification',
              allowPublicRegistration: 'Allow Public Registration',
              maintenanceMode: 'Maintenance Mode'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="text-gray-700 font-medium">{label}</span>
                  {key === 'maintenanceMode' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Temporarily disable public access for maintenance
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={systemSettings[key]}
                    onChange={(e) => setSystemSettings({...systemSettings, [key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <Button onClick={handleSystemSettingsSave} variant="danger">
              <Save size={18} />
              Save System Settings
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Choose what notifications you want to receive</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries({
              emailNotifications: 'Email Notifications',
              newUserRegistrations: 'New User Registrations',
              mentorApprovals: 'Mentor Approval Requests',
              systemAlerts: 'System Alerts',
              dailyReport: 'Daily Analytics Report'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-700">{label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <Button onClick={handleNotificationSave}>
              <Save size={18} />
              Save Notifications
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-600">Customize your admin experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handlePreferencesSave}>
              <Save size={18} />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Important Notice</p>
            <p>Changes to system settings may affect all users. Please ensure you understand the implications before saving changes.</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
