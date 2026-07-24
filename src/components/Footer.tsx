import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Mediqo<span className="text-blue-500">.</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering clinics with seamless patient care, intelligent scheduling, and modern practitioner workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-white transition-colors">Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clinical Specialities</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>General Medicine</li>
              <li>Gynecology & Obstetrics</li>
              <li>Dermatology & Cosmetology</li>
              <li>Pediatrics & Neonatology</li>
              <li>Neurology & Spine Care</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clinic Address</h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>Mediqo Healthcare Tower, 12th Avenue, Medical Hub, City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+1 (800) 555-MEDI</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>care@mediqo.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Mediqo CMS. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Security Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
