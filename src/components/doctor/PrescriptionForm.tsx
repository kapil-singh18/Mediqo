import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, Pill, FileText, Calendar, User, Phone } from 'lucide-react';
import { PrescriptionMedicine, PrescriptionPayload } from '../../services/doctorApi';

interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionPayload>;
  patientInfo?: { id: string; name: string; phone?: string; appointmentId?: string; appointmentDate?: string };
  onSubmit: (payload: PrescriptionPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  initialData,
  patientInfo,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [patientId] = useState<string>(patientInfo?.id || initialData?.patientId || '');
  const [patientName, setPatientName] = useState<string>(patientInfo?.name || initialData?.patientName || '');
  const [patientPhone, setPatientPhone] = useState<string>(patientInfo?.phone || initialData?.patientPhone || '');
  const [appointmentId] = useState<string>(patientInfo?.appointmentId || initialData?.appointmentId || '');
  const [appointmentDate, setAppointmentDate] = useState<string>(
    patientInfo?.appointmentDate || initialData?.appointmentDate || new Date().toISOString().split('T')[0]
  );
  const [diagnosis, setDiagnosis] = useState<string>(initialData?.diagnosis || '');
  const [instructions, setInstructions] = useState<string>(initialData?.instructions || '');
  const [followUpDate, setFollowUpDate] = useState<string>(initialData?.followUpDate || '');
  const [status, setStatus] = useState<'Completed' | 'Draft'>(initialData?.status || 'Completed');

  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>(
    initialData?.medicines && initialData.medicines.length > 0
      ? initialData.medicines
      : [
          { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
        ]
  );

  const [error, setError] = useState<string | null>(null);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) {
      setError('Prescription must contain at least one medicine');
      return;
    }
    setError(null);
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim()) {
      setError('Patient name is required');
      return;
    }

    if (!diagnosis.trim()) {
      setError('Clinical diagnosis is required');
      return;
    }

    for (let i = 0; i < medicines.length; i++) {
      if (!medicines[i].name.trim()) {
        setError(`Medicine #${i + 1} name cannot be empty`);
        return;
      }
    }

    try {
      await onSubmit({
        patientId: patientId || 'patient_guest',
        patientName,
        patientPhone,
        appointmentId,
        appointmentDate,
        diagnosis,
        instructions,
        followUpDate,
        status,
        medicines,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save prescription');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#5F6FFF]" />
            {initialData ? 'Edit Prescription' : 'New Patient Prescription'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Fill out clinical diagnosis, dosage schedules, and advice.</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Completed' | 'Draft')}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          >
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl border border-rose-200">
          {error}
        </div>
      )}

      {/* Patient & Date Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
            <User className="w-3.5 h-3.5 text-[#5F6FFF]" />
            Patient Name *
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            Patient Phone
          </label>
          <input
            type="text"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="e.g. +1 555-0199"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Consultation Date
          </label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        </div>
      </div>

      {/* Clinical Diagnosis */}
      <div>
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <FileText className="w-4 h-4 text-[#5F6FFF]" />
          Clinical Diagnosis *
        </label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g. Acute Upper Respiratory Tract Infection, Allergic Rhinitis"
          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          required
        />
      </div>

      {/* Dynamic Medicines Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-emerald-600" />
            Prescribed Medicines List
          </label>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#5F6FFF] hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Medicine
          </button>
        </div>

        <div className="space-y-3">
          {medicines.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 items-center"
            >
              <div className="sm:col-span-4">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Medicine Name</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5F6FFF]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Dosage</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  placeholder="1 tablet"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5F6FFF]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Frequency</label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                  placeholder="Twice daily (After food)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5F6FFF]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Duration</label>
                <input
                  type="text"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                  placeholder="5 days"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5F6FFF]"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end sm:justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions & Follow-up Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
            Instructions & Dietary Advice
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Drink plenty of warm liquids. Rest adequately for 3 days."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
            Next Follow-up Date (Optional)
          </label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="border-t border-slate-100 pt-5 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5F6FFF] hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Saving...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Issue Prescription</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
