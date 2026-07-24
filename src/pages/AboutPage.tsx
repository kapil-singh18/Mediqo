import React from 'react';
import { doctorsData } from '../assets/assets';
import { ShieldCheck, Award, Zap, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-[#5F6FFF] uppercase tracking-wider">Our Story & Mission</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ABOUT <span className="text-[#5F6FFF]">MEDIQO</span>
        </h1>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 sm:p-12 rounded-[20px] border border-slate-200/80 shadow-2xs">
        <div className="md:w-1/2">
          <img
            src={doctorsData[0].image}
            alt="About Mediqo"
            className="w-full max-w-md mx-auto rounded-[16px] border border-slate-200 bg-[#EAEEFF] shadow-md object-cover"
          />
        </div>

        <div className="md:w-1/2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to Mediqo, your trusted healthcare partner dedicated to connecting patients with top-tier medical specialists through effortless digital scheduling and clinical management.
          </p>
          <p>
            Mediqo is committed to excellence in digital health technology. We continuously refine our platform to eliminate waiting rooms, streamline consultation records, and deliver a transparent medical booking experience.
          </p>
          <div className="pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5F6FFF]" /> Our Vision
            </h3>
            <p>
              To bridge the gap between patients and healthcare providers globally, ensuring immediate, reliable, and patient-centered medical access.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            WHY <span className="text-[#5F6FFF]">CHOOSE US</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-[16px] border border-slate-200/80 hover:border-[#5F6FFF] hover:shadow-lg transition-all group space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#5F6FFF] transition-colors">EFFICIENCY:</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Streamlined appointment scheduling that fits seamlessly into your lifestyle.
            </p>
          </div>

          <div className="p-8 bg-white rounded-[16px] border border-slate-200/80 hover:border-[#5F6FFF] hover:shadow-lg transition-all group space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#5F6FFF] transition-colors">CONVENIENCE:</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access to an exclusive network of verified medical professionals in your city.
            </p>
          </div>

          <div className="p-8 bg-white rounded-[16px] border border-slate-200/80 hover:border-[#5F6FFF] hover:shadow-lg transition-all group space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#5F6FFF] transition-colors">PERSONALIZATION:</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tailored consultation reminders and medical history tracking for proactive health management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


