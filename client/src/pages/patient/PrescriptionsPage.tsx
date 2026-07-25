import React, { useState, useEffect } from 'react';
import { FileText, Stethoscope, Calendar, Pill, Printer, ShieldCheck } from 'lucide-react';
import { Prescription } from '../../types';
import { patientApi } from '../../services/patientApi';
import { EmptyState } from '../../components/patient/EmptyState';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await patientApi.getMyPrescriptions();
        setPrescriptions(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <PageHeader
        title="My Prescriptions"
        subtitle="Read-only record of medicines, dosages, and clinical advice issued by your consulting doctors."
        badgeText="Digital Pharmacy Records"
        action={
          prescriptions.length > 0 ? (
            <Button
              variant="outline"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </Button>
          ) : undefined
        }
      />

      {/* Main Prescriptions List */}
      {loading ? (
        <LoadingSpinner label="Loading digital prescriptions..." />
      ) : prescriptions.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No Prescriptions Issued"
          description="You currently have no medical prescriptions recorded. Doctor prescriptions will automatically appear here following your completed appointments."
        />
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => (
            <Card
              key={rx._id}
              className="p-6 sm:p-8 space-y-6 overflow-hidden relative border border-slate-200"
            >
              {/* Rx Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center font-bold shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{rx.doctorName}</h3>
                    <p className="text-xs text-[#5F6FFF] font-semibold">{rx.doctorSpeciality}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Prescribed on <strong className="text-slate-800">{rx.appointmentDate}</strong></span>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="bg-[#F0F3FF] p-4 rounded-[12px] border border-[#5F6FFF]/20 space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#5F6FFF] tracking-wider">Clinical Diagnosis</p>
                <p className="text-sm font-bold text-slate-900">{rx.diagnosis}</p>
              </div>

              {/* Medicines Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <Pill className="w-4 h-4 mr-1.5 text-[#5F6FFF]" /> Prescribed Medicines
                </h4>

                <div className="overflow-x-auto rounded-[12px] border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                        <th className="py-3 px-4">Medicine Name</th>
                        <th className="py-3 px-4">Dosage</th>
                        <th className="py-3 px-4">Frequency</th>
                        <th className="py-3 px-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rx.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-slate-900">{med.name}</td>
                          <td className="py-3 px-4 text-slate-600">{med.dosage}</td>
                          <td className="py-3 px-4 text-slate-600">{med.frequency}</td>
                          <td className="py-3 px-4 font-semibold text-[#5F6FFF]">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Instructions */}
              {rx.instructions && (
                <div className="space-y-1 bg-slate-50 p-4 rounded-[12px] border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800">Doctor's Special Instructions:</p>
                  <p className="text-slate-600 leading-relaxed">{rx.instructions}</p>
                </div>
              )}

              {/* Rx Footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Mediqo Verified Digital Prescription
                </span>
                <span>Rx ID: {rx._id}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
