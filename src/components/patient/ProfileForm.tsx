import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, MapPin, Calendar, UserCheck, Mail, Camera, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Card } from '../ui/Card';
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
    <Card className="p-8 border border-slate-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Photo Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#F0F3FF] shadow-md"
            />
            <div className="absolute bottom-0 right-0 p-1.5 bg-[#5F6FFF] text-white rounded-full shadow-xs">
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
          <Input
            label="Full Name"
            icon={<User className="w-4 h-4 text-slate-400" />}
            {...register('name')}
            error={errors.name?.message}
            placeholder="Jane Doe"
          />

          <Input
            label="Email Address (Read-Only)"
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            type="email"
            value={user.email}
            disabled
          />

          <Input
            label="Phone Number"
            icon={<Phone className="w-4 h-4 text-slate-400" />}
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 555-0192"
          />

          <Input
            label="Age (Years)"
            icon={<Calendar className="w-4 h-4 text-slate-400" />}
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            placeholder="28"
          />

          <Select
            label="Gender"
            icon={<UserCheck className="w-4 h-4 text-slate-400" />}
            {...register('gender')}
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
              { label: 'Prefer not to say', value: 'Not specified' },
            ]}
          />

          <div className="md:col-span-2">
            <TextArea
              label="Residential Address"
              {...register('address')}
              rows={2}
              placeholder="123 Health Ave, Suite 4B, New York, NY"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            isLoading={submitting}
            variant="primary"
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};
