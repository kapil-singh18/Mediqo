import React, { useEffect, useState } from 'react';
import { doctorApi } from '../../services/doctorApi';
import { Clock, Calendar, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card, SectionCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

export const DoctorAvailabilityPage: React.FC = () => {
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [consultationDuration, setConsultationDuration] = useState<number>(20);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newSlotInput, setNewSlotInput] = useState('');

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await doctorApi.getAvailability();
      if (res.success && res.data) {
        setWorkingDays(res.data.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
        setAvailableSlots(res.data.availableSlots || DEFAULT_SLOTS.slice(0, 6));
        setConsultationDuration(res.data.consultationDuration || 20);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch availability settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      if (workingDays.length === 1) {
        setErrorMessage('Select at least one working day');
        return;
      }
      setErrorMessage(null);
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setErrorMessage(null);
      setWorkingDays([...workingDays, day]);
    }
  };

  const toggleSlot = (slot: string) => {
    if (availableSlots.includes(slot)) {
      if (availableSlots.length === 1) {
        setErrorMessage('Select at least one available slot');
        return;
      }
      setErrorMessage(null);
      setAvailableSlots(availableSlots.filter((s) => s !== slot));
    } else {
      setErrorMessage(null);
      setAvailableSlots([...availableSlots, slot]);
    }
  };

  const handleAddCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotInput.trim()) return;
    const formatted = newSlotInput.trim();
    if (!availableSlots.includes(formatted)) {
      setAvailableSlots([...availableSlots, formatted]);
    }
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slot: string) => {
    if (availableSlots.length === 1) {
      setErrorMessage('Select at least one available slot');
      return;
    }
    setAvailableSlots(availableSlots.filter((s) => s !== slot));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await doctorApi.updateAvailability({
        workingDays,
        availableSlots,
        consultationDuration,
      });

      setSuccessMessage('Working hours and consultation slots updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-12 border border-slate-200 text-center text-xs text-slate-400">
        Loading availability preferences...
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <PageHeader
        title="Manage Consultation Availability"
        subtitle="Configure your active consultation days, available time slots, and appointment slot duration."
        badgeText="Schedule & Time Slots"
        action={
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        }
      />

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-[12px] text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-[12px] text-xs font-bold border border-rose-200">
          {errorMessage}
        </div>
      )}

      {/* Working Days Selector */}
      <SectionCard title="Active Working Days" icon={<Calendar className="w-4 h-4 text-[#5F6FFF]" />}>
        <p className="text-xs text-slate-500 mb-3">Days when patients are permitted to book online appointments.</p>

        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => {
            const isSelected = workingDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Consultation Duration Selector */}
      <SectionCard title="Slot Consultation Duration" icon={<Clock className="w-4 h-4 text-[#5F6FFF]" />}>
        <p className="text-xs text-slate-500 mb-3">Average duration allocated per patient consultation session.</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[15, 20, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setConsultationDuration(mins)}
              className={`p-3 rounded-[12px] text-xs font-extrabold transition-all border text-center ${
                consultationDuration === mins
                  ? 'bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Available Time Slots Manager */}
      <Card className="p-6 sm:p-8 space-y-6 border border-slate-200">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Daily Available Time Slots
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select from presets or add custom consultation time slots.</p>
        </div>

        {/* Preset Slots Grid */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Preset Consultation Slots</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SLOTS.map((slot) => {
              const active = availableSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Slot Input */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Add Custom Time Slot</p>
          <form onSubmit={handleAddCustomSlot} className="flex items-center gap-2 max-w-sm">
            <div className="flex-1">
              <Input
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                placeholder="e.g. 07:30 PM"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </form>
        </div>

        {/* Selected Slots List */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Currently Configured Active Slots ({availableSlots.length})</p>
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-2 bg-[#F0F3FF] text-[#5F6FFF] border border-[#5F6FFF]/20 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
