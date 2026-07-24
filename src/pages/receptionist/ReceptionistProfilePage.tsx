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
  Building,
} from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Building className="w-6 h-6 text-purple-700" />
          Receptionist Desk Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage your receptionist identity, desk allocation, and working shift configuration.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-extrabold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 p-6 flex items-end justify-between">
          <div className="flex items-center space-x-4 transform translate-y-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-700 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
              {name?.charAt(0) || 'R'}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{name || 'Receptionist'}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 bg-white/20 px-2.5 py-0.5 rounded-full">
                Reception Staff
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-12 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Full Staff Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Work Email (Read Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 text-xs font-bold bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Contact Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full pl-10 pr-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Desk Location / Lobby Number
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={deskLocation}
                  onChange={(e) => setDeskLocation(e.target.value)}
                  placeholder="Desk A - Main Entrance Lobby"
                  className="w-full pl-10 pr-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
              Duty Shift Hours
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={shiftHours}
                onChange={(e) => setShiftHours(e.target.value)}
                placeholder="08:00 AM - 04:00 PM (Morning Shift)"
                className="w-full pl-10 pr-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3 text-xs text-purple-900 font-medium">
            <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
            <span>
              Your profile changes are synchronized across desk operations. Authorized role: <strong>Receptionist</strong>.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-extrabold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save Desk Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
