import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Stethoscope, Users, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <Stethoscope className="w-4 h-4" />
            <span>Consultant Physician Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Good day, {user?.name || 'Doctor'}!
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Speciality: <strong className="text-white">{user?.speciality || 'General Medicine'}</strong> | Experience: <strong className="text-white">{user?.experience || 'N/A'}</strong>
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Stethoscope className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Metrics Row Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Patients</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">0 Queued</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Consultations Completed</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">0 Sessions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Consultation Time</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">15 Mins / Patient</p>
          </div>
        </div>
      </div>

      {/* Console Workspace Notice */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 text-emerald-600">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-bold text-gray-900">Practitioner Workspace Initialized</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Doctor consultation console layout is ready. Patient token queue management and digital prescription entry will be active in upcoming modules.
        </p>
      </div>
    </div>
  );
};
