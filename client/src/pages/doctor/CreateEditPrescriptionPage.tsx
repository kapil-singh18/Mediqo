import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { doctorApi, PrescriptionPayload } from '../../services/doctorApi';
import { PrescriptionForm } from '../../components/doctor/PrescriptionForm';
import { ArrowLeft } from 'lucide-react';

export const CreateEditPrescriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!!id);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<Partial<PrescriptionPayload> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Extract query params for pre-filling when coming from appointment
  const patientInfo = {
    id: searchParams.get('patientId') || '',
    name: searchParams.get('patientName') || '',
    phone: searchParams.get('patientPhone') || '',
    appointmentId: searchParams.get('appointmentId') || '',
    appointmentDate: searchParams.get('appointmentDate') || '',
  };

  useEffect(() => {
    if (id) {
      const fetchRx = async () => {
        try {
          setLoading(true);
          const res = await doctorApi.getPrescriptionById(id);
          if (res.success && res.data.prescription) {
            setInitialData(res.data.prescription);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch prescription details');
        } finally {
          setLoading(false);
        }
      };
      fetchRx();
    }
  }, [id]);

  const handleSubmit = async (payload: PrescriptionPayload) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await doctorApi.updatePrescription(id, payload);
      } else {
        await doctorApi.createPrescription(payload);
      }
      navigate('/doctor/prescriptions');
    } catch (err: any) {
      alert(err.message || 'Failed to save prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-xs text-slate-400">
        Loading prescription details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/doctor/prescriptions" className="inline-flex items-center text-xs font-bold text-[#5F6FFF]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Prescriptions
        </Link>
        <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl border border-rose-200 text-xs font-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <Link
        to="/doctor/prescriptions"
        className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-[#5F6FFF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to All Prescriptions
      </Link>

      <PrescriptionForm
        initialData={initialData}
        patientInfo={patientInfo}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/doctor/prescriptions')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
