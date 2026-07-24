import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Stethoscope, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { doctorsData } from '../../assets/assets';
import { patientApi } from '../../services/patientApi';
import { Button } from '../../components/ui/Button';
import { Card, SectionCard } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

const bookSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  appointmentDate: z.string().min(1, 'Please select an appointment date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  reason: z.string().min(3, 'Please describe your reason for visit (min 3 characters)'),
  notes: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const initialDocId = searchParams.get('doctorId') || searchParams.get('doctor') || doctorsData[0]._id;

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      doctorId: initialDocId,
      appointmentDate: todayStr,
      timeSlot: TIME_SLOTS[0],
      reason: 'General consultation and health checkup',
      notes: '',
    },
  });

  const selectedDoctorId = watch('doctorId');
  const selectedTimeSlot = watch('timeSlot');

  const selectedDoctor = doctorsData.find((d) => d._id === selectedDoctorId) || doctorsData[0];

  useEffect(() => {
    if (searchParams.get('doctorId')) {
      setValue('doctorId', searchParams.get('doctorId') || doctorsData[0]._id);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: BookFormValues) => {
    setSubmitting(true);
    try {
      const doc = doctorsData.find((d) => d._id === values.doctorId) || doctorsData[0];
      await patientApi.bookAppointment({
        doctorId: doc._id,
        doctorName: doc.name,
        doctorSpeciality: doc.speciality,
        doctorImage: doc.image,
        fees: doc.fees,
        appointmentDate: values.appointmentDate,
        timeSlot: values.timeSlot,
        reason: values.reason,
        notes: values.notes,
      });

      toast.success('Appointment scheduled successfully!');
      navigate('/patient/appointments');
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#5F6FFF] rounded-[16px] p-6 sm:p-8 text-white shadow-md shadow-[#5F6FFF]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Seamless Care Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Book Doctor Appointment
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Select your preferred medical specialist, pick an available slot, and confirm your visit.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Select Doctor */}
        <SectionCard
          title="1. Select Medical Specialist"
          subtitle="Choose from our verified clinical specialists"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorsData.map((doc) => {
              const isSelected = selectedDoctorId === doc._id;
              return (
                <div
                  key={doc._id}
                  onClick={() => setValue('doctorId', doc._id)}
                  className={`cursor-pointer rounded-[12px] p-4 border transition-all flex items-center space-x-4 ${
                    isSelected
                      ? 'border-[#5F6FFF] bg-[#F0F3FF] shadow-xs ring-2 ring-[#5F6FFF]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5F6FFF] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#5F6FFF] font-semibold truncate">{doc.speciality}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.experience} • Fee: ${doc.fees}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.doctorId && <p className="text-xs text-rose-500 font-medium">{errors.doctorId.message}</p>}
        </SectionCard>

        {/* Step 2: Date & Time Slot */}
        <SectionCard
          title="2. Select Date & Time Slot"
          subtitle="Pick a date and consultation window that fits your schedule"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Appointment Date
              </label>
              <input
                type="date"
                min={todayStr}
                {...register('appointmentDate')}
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#5F6FFF] focus:ring-2 focus:ring-[#5F6FFF]/15 transition-all"
              />
              {errors.appointmentDate && (
                <p className="text-xs text-rose-500 font-medium">{errors.appointmentDate.message}</p>
              )}
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Available Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSlotSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setValue('timeSlot', slot)}
                      className={`py-2 px-2 text-xs font-bold rounded-[8px] border transition-all ${
                        isSlotSelected
                          ? 'bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.timeSlot && (
                <p className="text-xs text-rose-500 font-medium">{errors.timeSlot.message}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Step 3: Reason & Notes */}
        <SectionCard
          title="3. Consultation Details"
          subtitle="Help your doctor prepare for your visit"
        >
          <div className="space-y-4">
            <Input
              label="Reason for Visit *"
              icon={<FileText className="w-4 h-4 text-slate-400" />}
              {...register('reason')}
              error={errors.reason?.message}
              placeholder="e.g. Annual physical exam, skin rash consultation, or follow-up visit"
            />

            <TextArea
              label="Additional Clinical Notes (Optional)"
              {...register('notes')}
              rows={3}
              placeholder="Mention any symptoms, ongoing medications, or specific requests..."
            />
          </div>
        </SectionCard>

        {/* Selected Doctor Summary & Action */}
        <Card className="bg-slate-900 text-white p-6 rounded-[16px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border-none">
          <div className="flex items-center space-x-4">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <p className="text-xs text-slate-400 font-medium">Booking with</p>
              <p className="text-base font-extrabold text-white">{selectedDoctor.name}</p>
              <p className="text-xs text-[#5F6FFF] font-bold">${selectedDoctor.fees} Consultation Fee</p>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={submitting}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Confirm & Book Appointment
          </Button>
        </Card>
      </form>
    </div>
  );
};
