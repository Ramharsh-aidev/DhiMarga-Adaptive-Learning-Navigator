import { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, X, Eye, EyeOff } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile, changePassword, uploadProfilePicture } from '../../services/profileService';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    approvalStatus: '',
    profilePicture: null,
    createdAt: null,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
      setEditForm({ name: data.name, email: data.email });
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to auth user if API fails
      if (authUser) {
        setProfile({
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          approvalStatus: authUser.approvalStatus,
        });
        setEditForm({ name: authUser.name, email: authUser.email });
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditForm({ name: profile.name, email: profile.email });
    }
    setEditMode(!editMode);
    setError(null);
  };

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      const data = await updateProfile(editForm);
      setProfile(data);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      setError(null);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMode(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setError(null);
      const data = await uploadProfilePicture(file);
      setProfile({ ...profile, profilePicture: data.profilePictureUrl });
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MENTOR': return 'primary';
      case 'STUDENT': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <PageLoader text="Loading profile..." />;

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}
        
        {success && (
          <Alert
            variant="success"
            title="Success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              {!passwordMode && (
                <Button
                  variant={editMode ? 'outline' : 'primary'}
                  onClick={handleEditToggle}
                >
                  {editMode ? (<><X className="w-4 h-4 mr-2" />Cancel</>) : 'Edit Profile'}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input id="profile-picture" type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(profile.role)}>{profile.role}</Badge>
                </div>
              </div>
            </div>

            {editMode && !passwordMode && (
              <div className="space-y-4 mb-6">
                <Input label="Name" icon={User} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Enter your name" />
                <Input label="Email" icon={Mail} type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Enter your email" />
                <Button variant="primary" onClick={handleUpdateProfile} fullWidth><Save className="w-4 h-4 mr-2" />Save Changes</Button>
              </div>
            )}

            {!editMode && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Update your password</p>
                  </div>
                  <Button variant={passwordMode ? 'outline' : 'primary'} onClick={() => { setPasswordMode(!passwordMode); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); setError(null); }}>
                    {passwordMode ? (<><X className="w-4 h-4 mr-2" />Cancel</>) : (<><Lock className="w-4 h-4 mr-2" />Change Password</>)}
                  </Button>
                </div>

                {passwordMode && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Input label="Current Password" icon={Lock} type={showCurrentPassword ? 'text' : 'password'} value={passwordForm.currentPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, currentPassword: e.target.value }); if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: '' }); }} placeholder="Enter current password" error={passwordErrors.currentPassword} />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">{showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    <div className="relative">
                      <Input label="New Password" icon={Lock} type={showNewPassword ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, newPassword: e.target.value }); if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: '' }); }} placeholder="Enter new password" error={passwordErrors.newPassword} />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">{showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    <div className="relative">
                      <Input label="Confirm New Password" icon={Lock} type={showConfirmPassword ? 'text' : 'password'} value={passwordForm.confirmPassword} onChange={(e) => { setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }); if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: '' }); }} placeholder="Confirm new password" error={passwordErrors.confirmPassword} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                    <Button variant="primary" onClick={handleChangePassword} fullWidth><Save className="w-4 h-4 mr-2" />Update Password</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Account Type</span>
                <Badge variant={getRoleBadgeVariant(profile.role)}>{profile.role}</Badge>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
