import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { receptionistApi } from '../../services/receptionistApi';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card, SectionCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ReceptionistProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deskLocation, setDeskLocation] = useState('');
  const [shiftHours, setShiftHours] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDeskLocation(user.deskLocation || 'Main Lobby Reception Desk A');
      setShiftHours(user.shiftHours || '08:00 AM - 04:00 PM');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const res = await receptionistApi.updateProfile({
        name,
        phone,
        deskLocation,
        shiftHours,
        profileImage,
      });

      if (res.success && res.data?.user) {
        updateUser(res.data.user);
        setSuccessMsg('Receptionist desk profile updated successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update desk profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <PageHeader
        title="Receptionist Desk Profile"
        subtitle="Manage your receptionist identity, desk allocation, and working shift configuration."
        badgeText="Staff Account"
      />

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[12px] text-xs font-extrabold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-[12px] text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Section */}
      <SectionCard title="Personal & Duty Details" subtitle="Update details visible on appointments desk records">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-[12px]">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'}
              alt={name || 'Receptionist'}
              className="w-16 h-16 rounded-[12px] object-cover border-2 border-white shadow-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">{name || 'Receptionist'}</h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6FFF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Reception Desk Staff
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Staff Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Work Email (Read Only)"
              type="email"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Contact Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555-0199"
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Desk Location / Lobby Number"
              value={deskLocation}
              onChange={(e) => setDeskLocation(e.target.value)}
              placeholder="Desk A - Main Entrance Lobby"
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <Input
            label="Duty Shift Hours"
            value={shiftHours}
            onChange={(e) => setShiftHours(e.target.value)}
            placeholder="08:00 AM - 04:00 PM (Morning Shift)"
            leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
          />

          {/* Security Banner */}
          <div className="p-4 bg-blue-50/60 rounded-[12px] border border-blue-100 flex items-center gap-3 text-xs text-slate-700 font-medium">
            <ShieldCheck className="w-5 h-5 text-[#5F6FFF] shrink-0" />
            <span>
              Your profile changes are synchronized across desk operations. Authorized role: <strong>Receptionist</strong>.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
            >
              {loading ? 'Saving Profile...' : 'Save Desk Settings'}
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};
