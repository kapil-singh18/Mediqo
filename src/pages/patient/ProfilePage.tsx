import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProfileForm } from '../../components/patient/ProfileForm';
import { patientApi } from '../../services/patientApi';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <LoadingSpinner label="Loading your profile..." />;
  }

  const handleSaveProfile = async (data: any) => {
    await patientApi.updateProfile(data);
    // Refresh page or trigger context update by reloading window or state
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-1">
        <span className="text-xs font-bold text-[#5F6FFF] uppercase tracking-wider">Account Settings</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal information, contact details, and medical profile.
        </p>
      </div>

      <ProfileForm user={user} onSave={handleSaveProfile} />
    </div>
  );
};
