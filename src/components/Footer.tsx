import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-slate-100 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4 pr-0 md:pr-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-[#5F6FFF] flex items-center justify-center text-white shadow-sm shadow-[#5F6FFF]/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Mediqo<span className="text-[#5F6FFF]">.</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Mediqo is a healthcare management platform committed to excellence in patient care, appointment scheduling, and seamless medical workflow automation for doctors and patients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#5F6FFF] transition-colors font-medium">Home</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-[#5F6FFF] transition-colors font-medium">All Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#5F6FFF] transition-colors font-medium">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#5F6FFF] transition-colors font-medium">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-[#5F6FFF] shrink-0" />
                <span>+1-800-555-MEDIQO</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-[#5F6FFF] shrink-0" />
                <span>care@mediqo.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#5F6FFF] shrink-0 mt-0.5" />
                <span>Mediqo Care Center, Bandra West, Mumbai, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>Copyright © {new Date().getFullYear()} Mediqo — All Rights Reserved.</p>
          <div className="flex space-x-6 text-slate-400 text-xs">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Healthcare Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


