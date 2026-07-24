import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Stethoscope, ArrowRight, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { loginSchema, LoginFormValues } from '../validations/auth';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserRole, ROLE_REDIRECTS } from '../constants';
import { doctorsData } from '../assets/assets';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const loggedUser = await login(data);
      const redirectPath = ROLE_REDIRECTS[loggedUser.role as UserRole] || '/';
      navigate(redirectPath);
    } catch (err) {
      // Handled in AuthContext toast
    }
  };

  const handleDemoFill = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-[20px] border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
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
                Healthcare Portal Access
              </span>
              <h3 className="text-2xl font-extrabold leading-snug">
                Welcome Back to Mediqo Care
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Sign in to manage appointments, access medical records, or review doctor schedules seamlessly.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Instant Online Appointment Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Verified Multi-Specialty Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>24/7 Digital Prescriptions & Invoices</span>
              </div>
            </div>
          </div>

          {/* Featured Doctor Avatar Banner */}
          <div className="z-10 pt-6 border-t border-white/15 flex items-center gap-3">
            <img
              src={doctorsData[0].image}
              alt="Doctor preview"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">Dr. Rajesh Sharma</p>
              <p className="text-[10px] text-blue-200">Chief Medical Director</p>
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 font-normal">
              Enter your credentials to access your personalized medical portal.
            </p>
          </div>

          {/* Quick Demo Fill Box */}
          <div className="bg-[#F0F3FF] p-3.5 rounded-[12px] border border-[#D6DDFF] space-y-2">
            <p className="text-[10px] font-bold text-[#5F6FFF] uppercase tracking-wider">Quick Demo Auto-Fill:</p>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoFill('dr.rajesh@mediqo.com')}
                className="px-2 py-1.5 rounded-[8px] bg-white border border-[#D6DDFF] text-slate-800 font-semibold hover:bg-blue-50 text-left truncate transition-colors"
                title="Dr. Rajesh Sharma (Doctor)"
              >
                👨‍⚕️ Doctor
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('receptionist@mediqo.com')}
                className="px-2 py-1.5 rounded-[8px] bg-white border border-[#D6DDFF] text-slate-800 font-semibold hover:bg-purple-50 text-left truncate transition-colors"
                title="Sunita Rao (Receptionist)"
              >
                👩‍💼 Receptionist
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('patient@mediqo.com')}
                className="px-2 py-1.5 rounded-[8px] bg-white border border-[#D6DDFF] text-slate-800 font-semibold hover:bg-emerald-50 text-left truncate transition-colors"
                title="Aarav Mehta (Patient)"
              >
                👤 Patient
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. user@mediqo.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" isLoading={isSubmitting} variant="primary" className="w-full py-3 text-xs font-bold uppercase tracking-wider">
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Register Redirect */}
          <div className="text-center pt-2 text-xs text-slate-500 font-medium">
            Don't have a patient account?{' '}
            <Link to="/register" className="font-bold text-[#5F6FFF] hover:underline">
              Create Patient Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

