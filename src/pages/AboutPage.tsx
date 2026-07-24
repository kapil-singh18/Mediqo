import React from 'react';
import { doctorsData } from '../assets/assets';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
          ABOUT <span className="text-[#5F6FFF]">US</span>
        </h1>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <img
            src={doctorsData[0].image}
            alt="About Mediqo"
            className="w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-[#EAEEFF] shadow-sm"
          />
        </div>

        <div className="md:w-1/2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to Mediqo, your trusted partner in managing your healthcare needs conveniently and efficiently. At Mediqo, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Mediqo is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Mediqo is here to support you every step of the way.
          </p>
          <div className="pt-2">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Our Vision</h3>
            <p>
              Our vision at Mediqo is to create a seamless healthcare experience for every patient. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
          WHY <span className="text-[#5F6FFF]">CHOOSE US</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 group cursor-pointer space-y-3">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-white">EFFICIENCY:</h3>
            <p className="text-xs text-slate-500 group-hover:text-blue-100 leading-relaxed">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 group cursor-pointer space-y-3">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-white">CONVENIENCE:</h3>
            <p className="text-xs text-slate-500 group-hover:text-blue-100 leading-relaxed">
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          <div className="p-8 sm:p-10 hover:bg-[#5F6FFF] hover:text-white transition-all duration-300 group cursor-pointer space-y-3">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-white">PERSONALIZATION:</h3>
            <p className="text-xs text-slate-500 group-hover:text-blue-100 leading-relaxed">
              Tailored reminders and health tips to help you stay on top of your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

