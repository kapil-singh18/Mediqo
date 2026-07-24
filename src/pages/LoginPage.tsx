import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Stethoscope, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormValues } from '../validations/auth';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserRole, ROLE_REDIRECTS } from '../constants';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Login to Mediqo</h2>
          <p className="text-xs text-gray-500">
            Enter your account credentials to access your portal.
          </p>
        </div>

        {/* Demo Quick Fill Buttons for ease of preview testing */}
        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-2">
          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Quick Demo Login Fill:</p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoFill('dr.richard@mediqo.com')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 text-left truncate"
            >
              👨‍⚕️ Dr. Richard (Doctor)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('receptionist@mediqo.com')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-purple-700 font-semibold hover:bg-purple-50 text-left truncate"
            >
              👩‍💼 Receptionist
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. user@mediqo.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full py-3">
            Sign In <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Register Redirect */}
        <div className="text-center pt-2 text-xs text-gray-500">
          Don't have a patient account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register as Patient
          </Link>
        </div>

      </div>
    </div>
  );
};
