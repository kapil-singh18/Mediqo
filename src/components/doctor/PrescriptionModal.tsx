import React from 'react';
import { X, Printer, Stethoscope, Calendar, User, Phone, FileText, Pill, CheckCircle2 } from 'lucide-react';
import { Prescription } from '../../types';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5F6FFF] to-blue-700 px-6 py-5 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Medical Prescription</h3>
              <p className="text-xs text-blue-100">Prescripto / Mediqo Healthcare</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Print Prescription"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Content */}
        <div className="p-8 space-y-6 print:p-6" id="printable-prescription">
          {/* Header Banner */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{prescription.doctorName}</h2>
              <p className="text-xs font-semibold text-[#5F6FFF]">{prescription.doctorSpeciality}</p>
              <p className="text-xs text-slate-500 mt-1">Mediqo Healthcare Tower, 12th Avenue</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#5F6FFF] border border-blue-100">
                Prescription #{prescription._id?.slice(-6).toUpperCase() || 'RX102'}
              </span>
              <p className="text-xs text-slate-500 mt-2 flex items-center justify-end gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Date: {prescription.appointmentDate || new Date().toISOString().split('T')[0]}
              </p>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#5F6FFF] flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Patient Name</p>
                <p className="text-sm font-bold text-slate-900">{prescription.patientName || 'Alex Morgan'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Contact Phone</p>
                <p className="text-sm font-bold text-slate-900">{prescription.patientPhone || '+1 555-0199'}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#5F6FFF]" />
              Clinical Diagnosis
            </p>
            <p className="text-sm font-bold text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {prescription.diagnosis}
            </p>
          </div>

          {/* Rx Medicines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#5F6FFF]" />
                Prescribed Medicines (Rx)
              </p>
              <span className="text-xs font-semibold text-slate-500">
                {prescription.medicines?.length || 0} Items
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Medicine</th>
                    <th className="px-4 py-2.5">Dosage</th>
                    <th className="px-4 py-2.5">Frequency</th>
                    <th className="px-4 py-2.5">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {prescription.medicines?.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">{med.name}</td>
                      <td className="px-4 py-3">{med.dosage}</td>
                      <td className="px-4 py-3 text-[#5F6FFF] font-semibold">{med.frequency}</td>
                      <td className="px-4 py-3">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions & Advice */}
          {prescription.instructions && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructions & Advice</p>
              <p className="text-xs text-slate-700 bg-amber-50/60 border border-amber-100 p-3 rounded-xl leading-relaxed">
                {prescription.instructions}
              </p>
            </div>
          )}

          {/* Follow up date */}
          {prescription.followUpDate && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs font-semibold text-slate-600">
                Next Follow-up Consultation Date:
              </p>
              <span className="text-xs font-bold text-[#5F6FFF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {prescription.followUpDate}
              </span>
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-700">Mediqo E-Prescription Portal</p>
              <p>Electronically generated & verified</p>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 font-bold tracking-wider mb-1">
                {prescription.doctorName}
              </div>
              <p className="text-[11px] font-semibold text-slate-500">Authorized Medical Signature</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
