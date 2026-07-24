import React from 'react';
import { doctorsData } from '../assets/assets';
import { MapPin, Phone, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-[#5F6FFF] uppercase tracking-wider">Get In Touch</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          CONTACT <span className="text-[#5F6FFF]">US</span>
        </h1>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-white p-8 sm:p-12 rounded-[20px] border border-slate-200/80 shadow-2xs">
        <div className="md:w-1/2">
          <img
            src={doctorsData[1].image}
            alt="Contact Mediqo"
            className="w-full max-w-md mx-auto rounded-[16px] border border-slate-200 bg-[#EAEEFF] shadow-md object-cover"
          />
        </div>

        <div className="md:w-1/2 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5F6FFF]" /> Our Headquarters
            </h3>
            <p className="text-slate-500 pl-6">
              Mediqo Care Tower, Suite 350 <br />
              742 Evergreen Ave, New York, NY 10001
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#5F6FFF]" /> Support & Enquiries
            </h3>
            <div className="text-slate-500 pl-6 space-y-1">
              <p>Tel: +1 (800) 555-MEDIQO</p>
              <p>Email: care@mediqo.com</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#5F6FFF]" /> Careers At Mediqo
            </h3>
            <p className="text-slate-500">
              Learn more about our clinical engineering, healthcare management, and medical ops opportunities.
            </p>
            <Button variant="outline" className="text-xs uppercase tracking-wider">
              Explore Openings <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


