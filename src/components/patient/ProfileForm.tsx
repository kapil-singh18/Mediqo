import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, MapPin, Calendar, UserCheck, Mail, Camera, Check } from 'lucide-react';
import { Button } from '../Button';
import { User as UserType } from '../../types';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(6, 'Valid phone number is required'),
  address: z.string().optional(),
  age: z.number().min(0, 'Age must be positive').max(120, 'Invalid age'),
  gender: z.enum(['Male', 'Female', 'Other', 'Not specified']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: UserType;
  onSave: (data: ProfileFormValues & { profileImage?: string }) => Promise<void>;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    user.profileImage || AVATAR_OPTIONS[0]
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      age: user.age || 28,
      gender: (user.gender as any) || 'Not specified',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitting(true);
    try {
      await onSave({ ...values, profileImage: selectedAvatar });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xs">
      {/* Profile Photo Header */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
        <div className="relative">
          <img
            src={selectedAvatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md"
          />
          <div className="absolute bottom-0 right-0 p-1.5 bg-[#5F6FFF] text-white rounded-full shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center sm:text-left space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Profile Avatar</p>
          <div className="flex items-center space-x-2">
            {AVATAR_OPTIONS.map((imgUrl, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setSelectedAvatar(imgUrl)}
                className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar === imgUrl ? 'border-[#5F6FFF] scale-105 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                {selectedAvatar === imgUrl && (
                  <div className="absolute inset-0 bg-[#5F6FFF]/30 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center">
            <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Full Name
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs"
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
        </div>

        {/* Email - Read Only */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Email Address
            </span>
            <span className="text-[10px] text-slate-400 font-normal uppercase">(Read-Only)</span>
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center">
            <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Phone Number
          </label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs"
            placeholder="+1 555-0192"
          />
          {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone.message}</p>}
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Age (Years)
          </label>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs"
            placeholder="28"
          />
          {errors.age && <p className="text-xs text-rose-500 font-medium">{errors.age.message}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Gender
          </label>
          <select
            {...register('gender')}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs bg-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Not specified">Prefer not to say</option>
          </select>
        </div>

        {/* Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Residential Address
          </label>
          <textarea
            {...register('address')}
            rows={2}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs"
            placeholder="123 Health Ave, Suite 4B, New York, NY"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#5F6FFF] hover:bg-[#4F5FEF] text-white rounded-full px-8 py-3 shadow-md shadow-indigo-100 font-bold text-sm"
        >
          {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  );
};
