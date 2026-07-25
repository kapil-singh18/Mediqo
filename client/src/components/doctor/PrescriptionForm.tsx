import React, { useState } from 'react';
import { Plus, Trash2, Send, Pill, FileText, Calendar, User, Phone } from 'lucide-react';
import { PrescriptionMedicine, PrescriptionPayload } from '../../services/doctorApi';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';

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
    <Card className="p-6 sm:p-8 border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#5F6FFF]"
            >
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3.5 rounded-[12px] border border-rose-200">
            {error}
          </div>
        )}

        {/* Patient & Date Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F0F3FF] p-4 rounded-[12px] border border-[#5F6FFF]/20">
          <Input
            label="Patient Name *"
            icon={<User className="w-4 h-4 text-[#5F6FFF]" />}
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            required
          />

          <Input
            label="Patient Phone"
            icon={<Phone className="w-4 h-4 text-emerald-600" />}
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="e.g. +1 555-0199"
          />

          <Input
            label="Consultation Date"
            icon={<Calendar className="w-4 h-4 text-[#5F6FFF]" />}
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>

        {/* Clinical Diagnosis */}
        <Input
          label="Clinical Diagnosis *"
          icon={<FileText className="w-4 h-4 text-[#5F6FFF]" />}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g. Acute Upper Respiratory Tract Infection, Allergic Rhinitis"
          required
        />

        {/* Dynamic Medicines Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              Prescribed Medicines List
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMedicine}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Medicine
            </Button>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 bg-slate-50/80 rounded-[12px] border border-slate-200/80 items-center"
              >
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Medicine Name</label>
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#5F6FFF]"
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
                    className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5F6FFF]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Frequency</label>
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                    placeholder="Twice daily (After food)"
                    className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5F6FFF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Duration</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    placeholder="5 days"
                    className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#5F6FFF]"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end sm:justify-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors"
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
          <TextArea
            label="Instructions & Dietary Advice"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Drink plenty of warm liquids. Rest adequately for 3 days."
          />

          <Input
            label="Next Follow-up Date (Optional)"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Issue Prescription
          </Button>
        </div>
      </form>
    </Card>
  );
};
