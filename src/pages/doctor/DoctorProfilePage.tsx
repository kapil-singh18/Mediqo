import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { doctorApi } from '../../services/doctorApi';
import { User as UserIcon, Phone, Mail, Award, Briefcase, MapPin, Save, CheckCircle2, Lock } from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { SectionCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';

export const DoctorProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [qualification, setQualification] = useState(user?.qualification || 'MBBS, MD');
  const [speciality, setSpeciality] = useState(user?.speciality || 'General Medicine');
  const [experience, setExperience] = useState(user?.experience || '5 Years');
  const [clinicAddress, setClinicAddress] = useState(user?.clinicAddress || 'Mediqo Healthcare Tower, 12th Avenue');
  const [bio, setBio] = useState(user?.bio || 'Experienced consultant dedicated to providing high-quality patient care and diagnosis.');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Name is required');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Phone number is required');
      return;
    }

    try {
      setSaving(true);
      const res = await doctorApi.updateProfile({
        name,
        phone,
        qualification,
        speciality,
        experience,
        clinicAddress,
        bio,
        profileImage,
      });

      if (res.success) {
        setSuccessMessage('Doctor profile updated successfully!');
        if (res.data?.user) {
          updateUser(res.data.user);
        }
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <PageHeader
        title="Doctor Profile Settings"
        subtitle="Update your professional details, contact information, qualifications, and clinic location."
        badgeText="Practitioner Identity"
        action={
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        }
      />

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-[12px] text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-[12px] text-xs font-bold border border-rose-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Details Card */}
        <SectionCard title="Basic Personal Information" icon={<UserIcon className="w-4 h-4 text-[#5F6FFF]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Name *"
              icon={<UserIcon className="w-4 h-4 text-slate-400" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Phone Number *"
              icon={<Phone className="w-4 h-4 text-slate-400" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              label="Email Address (Read Only)"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              value={user?.email || ''}
              disabled
            />

            <Input
              label="Profile Image URL (Optional)"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </SectionCard>

        {/* Medical Practice & Clinic Card */}
        <SectionCard title="Professional Qualifications & Practice Location" icon={<Award className="w-4 h-4 text-[#5F6FFF]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Medical Qualification"
              icon={<Award className="w-4 h-4 text-slate-400" />}
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="MBBS, MD"
            />

            <Input
              label="Specialization"
              icon={<Briefcase className="w-4 h-4 text-slate-400" />}
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              placeholder="General Medicine"
            />

            <Input
              label="Years of Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="5 Years"
            />
          </div>

          <Input
            label="Clinic / Hospital Address"
            icon={<MapPin className="w-4 h-4 text-slate-400" />}
            value={clinicAddress}
            onChange={(e) => setClinicAddress(e.target.value)}
            placeholder="Mediqo Healthcare Tower, 12th Avenue"
          />

          <TextArea
            label="Professional Biography"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a brief professional overview for patients..."
          />
        </SectionCard>
      </form>
    </div>
  );
};
