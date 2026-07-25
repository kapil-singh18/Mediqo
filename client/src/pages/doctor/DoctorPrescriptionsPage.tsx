import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../services/doctorApi';
import { Prescription } from '../../types';
import { StatusBadge } from '../../components/doctor/StatusBadge';
import { PrescriptionModal } from '../../components/doctor/PrescriptionModal';
import {
  FileText,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Pill,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';

export const DoctorPrescriptionsPage: React.FC = () => {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Completed' | 'Draft'>('all');

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await doctorApi.getPrescriptions(searchTerm);
      if (res.success) {
        setPrescriptions(res.data.prescriptions || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrescriptions();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await doctorApi.deletePrescription(id);
      fetchPrescriptions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete prescription');
    }
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (statusFilter === 'all') return true;
    return (rx.status || 'Completed') === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PageHeader
        title="Prescription Management"
        subtitle="Create, issue, edit, and review patient medical prescriptions."
        badgeText="Clinical Documentation"
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/doctor/prescriptions/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Prescription
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-200 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => {
                setSearchTerm('');
                fetchPrescriptions();
              }}
              placeholder="Search by patient name or diagnosis..."
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full">
            {[
              { id: 'all', label: 'All Prescriptions' },
              { id: 'Completed', label: 'Completed' },
              { id: 'Draft', label: 'Drafts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-[#5F6FFF] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-500">
            Total: <strong className="text-slate-900">{filteredPrescriptions.length}</strong> Record(s)
          </p>
        </div>
      </Card>

      {/* Prescriptions List Grid */}
      {loading ? (
        <Card className="p-12 border border-slate-200 text-center text-xs text-slate-400">
          Loading prescriptions...
        </Card>
      ) : error ? (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-[12px] text-xs font-semibold border border-rose-200">
          {error}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <Card className="p-12 border border-slate-200 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No prescriptions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't created any prescriptions matching this criteria yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map((rx) => (
            <Card
              key={rx._id}
              className="p-6 border border-slate-200 hover:border-[#5F6FFF]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5F6FFF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    #{rx._id.slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={rx.status || 'Completed'} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {rx.patientName || 'Alex Morgan'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Date: {rx.appointmentDate}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-200 text-xs">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Diagnosis</p>
                  <p className="text-slate-900 font-bold mt-0.5 truncate">{rx.diagnosis}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Medicines Prescribed: <strong className="text-slate-900">{rx.medicines?.length || 0} Item(s)</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPrescription(rx)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5F6FFF] hover:text-blue-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View & Print
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => navigate(`/doctor/prescriptions/edit/${rx._id}`)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-[8px] transition-colors"
                    title="Edit Prescription"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(rx._id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Prescription View Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};
