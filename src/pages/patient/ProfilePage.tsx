import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProfileForm } from '../../components/patient/ProfileForm';
import { patientApi } from '../../services/patientApi';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { PageHeader } from '../../components/ui/LayoutPrimitives';

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <LoadingSpinner label="Loading your profile..." />;
  }

  const handleSaveProfile = async (data: any) => {
    await patientApi.updateProfile(data);
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Banner */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, contact details, and medical profile."
        badgeText="Account Settings"
      />

      <ProfileForm user={user} onSave={handleSaveProfile} />
    </div>
  );
};
