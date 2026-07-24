import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-10 border-t border-slate-200/80 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2 max-w-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5F6FFF] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Mediqo<span className="text-[#5F6FFF]">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">COMPANY</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#5F6FFF] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#5F6FFF] transition-colors">About us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#5F6FFF] transition-colors">Contact us</Link>
              </li>
              <li>
                <span className="hover:text-[#5F6FFF] transition-colors cursor-pointer">Privacy policy</span>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">GET IN TOUCH</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>+1-212-456-7890</li>
              <li>care@mediqo.com</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>Copyright © {new Date().getFullYear()} Mediqo — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

