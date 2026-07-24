import React from 'react';
import { Stethoscope, ShieldCheck, Award, HeartHandshake, Users, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          About Mediqo
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Transforming Clinic Management for Modern Healthcare
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Mediqo is a specialized Clinic Management System built to bridge the gap between patients, healthcare practitioners, and reception staff.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Patient-Centric Care</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Quick online appointment booking with zero waiting times, automated queue token updates, and transparent physician details.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Doctor Efficiency</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Tailored practitioner consoles allowing doctors to focus on diagnosis, treatment, and digital prescription issuance.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Reception Desk Control</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Simplified walk-in token allocation and real-time consultation coordination between front desk and doctors.
          </p>
        </div>
      </div>
    </div>
  );
};
