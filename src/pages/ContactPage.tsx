import React from 'react';
import { doctorsData } from '../assets/assets';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
          CONTACT <span className="text-[#5F6FFF]">US</span>
        </h1>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="md:w-1/2">
          <img
            src={doctorsData[1].image}
            alt="Contact Mediqo"
            className="w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-[#EAEEFF] shadow-sm"
          />
        </div>

        <div className="md:w-1/2 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">OUR OFFICE</h3>
            <p className="text-slate-500">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Tel: (415) 555-0132 <br />
              Email: care@mediqo.com
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">CAREERS AT MEDIQO</h3>
            <p className="text-slate-500">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-slate-900 text-slate-900 px-8 py-3 rounded-none text-xs font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

