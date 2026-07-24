import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  ArrowRight,
  Clock,
  Phone,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { doctorsData, specialityData } from '../assets/assets';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#5F6FFF] rounded-3xl p-8 sm:p-12 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/10">
          
          {/* Left Copy */}
          <div className="md:w-1/2 space-y-6 z-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Book Appointment <br className="hidden sm:inline" />With 100+ Trusted Doctors
            </h1>

            <p className="text-sm sm:text-base text-blue-100 max-w-md mx-auto md:mx-0 font-normal leading-relaxed">
              Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </p>

            <div className="pt-2">
              {user ? (
                <Link to="/patient">
                  <button className="bg-white text-[#5F6FFF] font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-200 inline-flex items-center text-sm shadow-md">
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              ) : (
                <Link to="/register">
                  <button className="bg-white text-[#5F6FFF] font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-200 inline-flex items-center text-sm shadow-md">
                    Create account <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Hero Doctor Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end z-10">
            <div className="relative w-full max-w-sm">
              <img
                src={doctorsData[0].image}
                alt="Mediqo Specialists"
                className="w-full h-auto max-h-96 object-cover object-top rounded-2xl border-4 border-white/20 shadow-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Specialities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find by Speciality
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {specialityData.map((item) => (
            <Link
              key={item.speciality}
              to={`/doctors?speciality=${encodeURIComponent(item.speciality)}`}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-[#5F6FFF]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 p-6 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 group-hover:bg-[#5F6FFF]/10 text-[#5F6FFF] flex items-center justify-center transition-colors">
                <Stethoscope className="w-7 h-7" />
              </div>
              <p className="text-xs font-semibold text-slate-700 group-hover:text-[#5F6FFF] transition-colors">
                {item.speciality}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Top Doctors to Book
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctorsData.slice(0, 8).map((doc) => (
            <Link
              key={doc._id}
              to={user ? `/patient/book?doctor=${doc._id}` : '/login'}
              className="group bg-white rounded-2xl border border-slate-200/70 hover:border-[#5F6FFF]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-[#EAEEFF] relative overflow-hidden flex items-end justify-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-semibold text-emerald-600">Available</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {doc.speciality}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs font-bold text-slate-800">${doc.fees}</span>
                <span className="text-xs font-semibold text-[#5F6FFF]">Book Now →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/doctors">
            <button className="bg-blue-50 text-[#5F6FFF] font-semibold px-8 py-3 rounded-full hover:bg-blue-100 transition-colors text-xs">
              more doctors
            </button>
          </Link>
        </div>
      </section>

      {/* Bottom Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#5F6FFF] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Book Appointment <br />With 100+ Trusted Doctors
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md">
              Create an account or login to schedule your consultation with experienced medical staff in under 1 minute.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <button className="bg-white text-[#5F6FFF] font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors text-xs shadow-md">
                  Create account
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <img
              src={doctorsData[1].image}
              alt="Doctor banner"
              className="h-56 object-cover object-top rounded-2xl border-4 border-white/20 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Footer Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#5F6FFF] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Mediqo Center</p>
              <p className="text-[11px] text-slate-500">12th Ave, Medical Tower, City</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#5F6FFF] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Direct Support</p>
              <p className="text-[11px] text-slate-500">+1 (800) 555-MEDIQO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#5F6FFF] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Working Hours</p>
              <p className="text-[11px] text-slate-500">Mon - Sat: 8:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

