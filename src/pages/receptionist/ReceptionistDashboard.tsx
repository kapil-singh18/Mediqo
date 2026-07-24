import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ClipboardList, Users, CalendarCheck, Shield, CheckCircle } from 'lucide-react';

export const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Reception Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <ClipboardList className="w-4 h-4" />
            <span>Front Desk Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Reception Desk — {user?.name || 'Staff'}
          </h1>
          <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
            Manage walk-in patient check-ins, issue consultation queue tokens, and maintain clinic doctor schedules in real-time.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <ClipboardList className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Metrics Row Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Patients</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">Ready for Check-in</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Doctors Active</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">3 On Duty</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Queue System</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Operational</p>
          </div>
        </div>
      </div>

      {/* Console Notice */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 text-purple-600">
          <Shield className="w-5 h-5" />
          <h3 className="text-lg font-bold text-gray-900">Reception Control Console</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Front desk layout is initialized. Patient queue management and appointment booking desks will be active in upcoming modules.
        </p>
      </div>
    </div>
  );
};
