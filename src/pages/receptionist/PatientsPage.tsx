import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { PatientModal } from '../../components/receptionist/PatientModal';
import { PatientDetailsModal } from '../../components/receptionist/PatientDetailsModal';
import { BookAppointmentModal } from '../../components/receptionist/BookAppointmentModal';
import { CreateBillModal } from '../../components/receptionist/CreateBillModal';

import {
  Users,
  Search,
  UserPlus,
  Filter,
  Eye,
  Edit,
  Calendar,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Doctors list for modals
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  // Modals state
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<User | null>(null);
  const [selectedPatientIdDetails, setSelectedPatientIdDetails] = useState<string | null>(null);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedPatientForAction, setSelectedPatientForAction] = useState<User | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const [res, docsRes] = await Promise.all([
        receptionistApi.getPatients({
          search,
          gender: genderFilter,
          page,
          limit: 15,
        }),
        receptionistApi.getDoctors(),
      ]);

      if (res.success && res.data) {
        setPatients(res.data.patients || []);
        setTotalPages(res.data.pagination?.pages || 1);
        setTotalPatients(res.data.pagination?.total || 0);
      }

      if (docsRes.success && docsRes.data) {
        setDoctorsList(docsRes.data.doctors || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, genderFilter, page]);

  const handleSavePatient = async (data: any) => {
    if (patientToEdit) {
      const id = patientToEdit.id || (patientToEdit as any)._id;
      await receptionistApi.updatePatient(id, data);
    } else {
      await receptionistApi.createPatient(data);
    }
    fetchPatients();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Title & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" />
            Patient Registry Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Search, register, edit and manage patient profile histories in the clinic system.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPatientToEdit(null);
              setPatientModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>

          <button
            onClick={fetchPatients}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Patients"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <span className="text-xs font-bold text-slate-400">
            Total: {totalPatients}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading patient records...</div>
        ) : patients.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No patient records found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200/80">
                  <th className="p-4 pl-6">Patient Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Age / Gender</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-right pr-6">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {patients.map((pt) => {
                  const ptId = pt.id || (pt as any)._id;
                  return (
                    <tr key={ptId} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-4 pl-6 font-extrabold text-slate-900">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center uppercase text-xs">
                            {pt.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{pt.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">#{ptId.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {pt.phone || 'N/A'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold">
                          {pt.age ? `${pt.age} yrs` : 'N/A'} • {pt.gender || 'N/A'}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {pt.email || 'None registered'}
                      </td>

                      <td className="p-4 text-slate-500 truncate max-w-xs">
                        {pt.address || 'Not specified'}
                      </td>

                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedPatientIdDetails(ptId)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="View Patient Details & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setPatientToEdit(pt);
                              setPatientModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            title="Edit Patient Info"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatientForAction(pt);
                              setBookModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                            title="Book Appointment"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatientForAction(pt);
                              setBillModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Issue Invoice"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PatientModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSubmit={handleSavePatient}
        patient={patientToEdit}
      />

      <PatientDetailsModal
        patientId={selectedPatientIdDetails}
        onClose={() => setSelectedPatientIdDetails(null)}
        onBookAppointment={(pt) => {
          setSelectedPatientIdDetails(null);
          setSelectedPatientForAction(pt);
          setBookModalOpen(true);
        }}
        onCreateBill={(pt) => {
          setSelectedPatientIdDetails(null);
          setSelectedPatientForAction(pt);
          setBillModalOpen(true);
        }}
      />

      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={fetchPatients}
        patientsList={patients}
        doctorsList={doctorsList}
        preselectedPatient={selectedPatientForAction}
      />

      <CreateBillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onSuccess={fetchPatients}
        patientsList={patients}
        doctorsList={doctorsList}
        preselectedPatient={selectedPatientForAction}
      />
    </div>
  );
};
