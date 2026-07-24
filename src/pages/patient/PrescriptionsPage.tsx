import React, { useState, useEffect } from 'react';
import { FileText, Stethoscope, Calendar, Pill, Download, Printer, ShieldCheck } from 'lucide-react';
import { Prescription } from '../../types';
import { patientApi } from '../../services/patientApi';
import { EmptyState } from '../../components/patient/EmptyState';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { Button } from '../../components/Button';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#5F6FFF] uppercase tracking-wider">Digital Pharmacy Records</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Prescriptions
          </h1>
          <p className="text-sm text-slate-500">
            Read-only record of medicines, dosages, and clinical advice issued by your consulting doctors.
          </p>
        </div>

        {prescriptions.length > 0 && (
          <Button
            variant="outline"
            onClick={handlePrint}
            className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 px-5 text-xs font-bold"
          >
            <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
          </Button>
        )}
      </div>

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
            <div
              key={rx._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-6 overflow-hidden relative"
            >
              {/* Rx Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5F6FFF] flex items-center justify-center font-bold flex-shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{rx.doctorName}</h3>
                    <p className="text-xs text-[#5F6FFF] font-semibold">{rx.doctorSpeciality}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Prescribed on <strong className="text-slate-800">{rx.appointmentDate}</strong></span>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60 space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#5F6FFF] tracking-wider">Clinical Diagnosis</p>
                <p className="text-sm font-bold text-slate-900">{rx.diagnosis}</p>
              </div>

              {/* Medicines Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <Pill className="w-4 h-4 mr-1.5 text-[#5F6FFF]" /> Prescribed Medicines
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px]">
                        <th className="py-3 px-4">Medicine Name</th>
                        <th className="py-3 px-4">Dosage</th>
                        <th className="py-3 px-4">Frequency</th>
                        <th className="py-3 px-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rx.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
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
                <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
