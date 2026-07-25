import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Stethoscope, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '../validations/auth';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { doctorsData } from '../assets/assets';

export const RegisterPage: React.FC = () => {
  const { register: registerPatient } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerPatient(data);
      navigate('/patient');
    } catch (err) {
      // Error handled in AuthContext toast
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-[20px] border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Branding / Feature Column */}
        <div className="md:col-span-5 bg-[#5F6FFF] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-white text-[#5F6FFF] flex items-center justify-center font-bold shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Mediqo.</span>
            </div>

            <div className="space-y-3 pt-4">
              <span className="inline-block px-3 py-1 bg-white/15 text-blue-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Patient Registration
              </span>
              <h3 className="text-2xl font-extrabold leading-snug">
                Join 10,000+ Patients On Mediqo
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Register in less than 60 seconds to unlock direct online doctor scheduling, instant prescriptions, and health tracking.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Zero Hidden Fees or Subscription Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Encrypted Patient Data Privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Instant Consultation Reminders</span>
              </div>
            </div>
          </div>

          {/* Featured Doctor Avatar Banner */}
          <div className="z-10 pt-6 border-t border-white/15 flex items-center gap-3">
            <img
              src={doctorsData[1].image}
              alt="Doctor preview"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">Dr. Sarah Johnson</p>
              <p className="text-[10px] text-blue-200">Senior Gynecologist & Care Advisor</p>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 rounded-[8px] bg-[#5F6FFF] text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">Mediqo.</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Patient Account</h2>
            <p className="text-xs text-slate-500 font-normal">
              Sign up to schedule appointments with verified Mediqo doctors.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Sarah Connor"
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="sarah@example.com"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone Number"
                placeholder="+1 555-0199"
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button type="submit" isLoading={isSubmitting} variant="primary" className="w-full py-3 text-xs font-bold uppercase tracking-wider mt-2">
              Register & Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Login Redirect */}
          <div className="text-center pt-2 text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#5F6FFF] hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

