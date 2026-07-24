import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Clock, UserCheck, Heart, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <UserCheck className="w-4 h-4" />
            <span>Verified Patient Account</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Patient'}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Manage your clinic consultations, book specialist appointments, and track your healthcare history seamlessly with Mediqo.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/doctors">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold shadow-md">
                Book New Appointment
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Heart className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Quick Summary Cards Placeholder Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Upcoming Visits</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">0 Active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Past Appointments</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">0 Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Active & Ready</p>
          </div>
        </div>
      </div>

      {/* Placeholder Workspace Notice */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 text-blue-600">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-bold text-gray-900">Patient Dashboard Workspace</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your patient dashboard foundation is initialized. Appointments booking, token queue tracking, and digital prescription history modules will populate in upcoming phases.
        </p>
      </div>
    </div>
  );
};
