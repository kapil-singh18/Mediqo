import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, XCircle, Stethoscope } from 'lucide-react';
import { Appointment } from '../../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '../Button';

interface AppointmentTableProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onCancel,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorSpeciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || apt.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor, specialty or reason..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter:
          </span>
          {['all', 'scheduled', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#5F6FFF] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
              <th className="py-3.5 px-6">Doctor</th>
              <th className="py-3.5 px-6">Date & Time</th>
              <th className="py-3.5 px-6">Reason</th>
              <th className="py-3.5 px-6">Fee</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 overflow-hidden flex-shrink-0 border border-indigo-100">
                        {apt.doctorImage ? (
                          <img
                            src={apt.doctorImage}
                            alt={apt.doctorName}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#5F6FFF]">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{apt.doctorName}</p>
                        <p className="text-[11px] text-[#5F6FFF] font-medium">{apt.doctorSpeciality}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{apt.appointmentDate}</p>
                    <p className="text-[11px] text-slate-400">{apt.timeSlot}</p>
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate">
                    <span className="text-slate-600">{apt.reason}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                    ₹{apt.fees}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(apt)}
                        className="text-slate-600 hover:text-[#5F6FFF] hover:bg-indigo-50 rounded-full px-3 py-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                      {apt.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                              onCancel(apt._id);
                            }
                          }}
                          className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-full px-3 py-1 text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No appointments match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <p>
            Showing <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredAppointments.length)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{filteredAppointments.length}</span> results
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
