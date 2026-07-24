import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Stethoscope, AlertCircle, Eye, XCircle } from 'lucide-react';
import { Appointment } from '../../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '../Button';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onViewDetails?: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onViewDetails,
}) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!onCancel) return;
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setCancelling(true);
      try {
        await onCancel(appointment._id);
      } finally {
        setCancelling(false);
      }
    }
  };

  const isCancelable = appointment.status === 'scheduled';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-2xl bg-indigo-50 overflow-hidden flex-shrink-0 border border-indigo-100">
            {appointment.doctorImage ? (
              <img
                src={appointment.doctorImage}
                alt={appointment.doctorName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#5F6FFF] font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{appointment.doctorName}</h4>
            <p className="text-xs text-[#5F6FFF] font-medium">{appointment.doctorSpeciality}</p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {appointment.appointmentDate}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {appointment.timeSlot}
              </span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between">
          <StatusBadge status={appointment.status} />
          <p className="text-sm font-extrabold text-slate-900 mt-2">
            ₹{appointment.fees}
          </p>
        </div>
      </div>

      <div className="bg-slate-50/70 p-3.5 rounded-2xl text-xs text-slate-600 space-y-1 border border-slate-100">
        <p className="font-semibold text-slate-800">Reason for visit:</p>
        <p className="line-clamp-2">{appointment.reason}</p>
        {appointment.notes && (
          <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/50">
            Note: {appointment.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-3 pt-1">
        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(appointment)}
            className="text-slate-600 hover:text-[#5F6FFF] hover:bg-indigo-50 rounded-full text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
          </Button>
        )}
        {isCancelable && onCancel && (
          <Button
            variant="outline"
            size="sm"
            disabled={cancelling}
            onClick={handleCancel}
            className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-full text-xs font-semibold"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        )}
      </div>
    </div>
  );
};
