import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  ArrowRight,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  UserCheck,
  HeartPulse,
  Sparkles,
  Baby,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { doctorsData, specialityData } from '../assets/assets';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Speciality icon mapping
  const getSpecialityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-7 h-7" />;
      case 'HeartPulse':
        return <HeartPulse className="w-7 h-7" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7" />;
      case 'Baby':
        return <Baby className="w-7 h-7" />;
      case 'Activity':
        return <Activity className="w-7 h-7" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7" />;
      default:
        return <Stethoscope className="w-7 h-7" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#5F6FFF] rounded-[24px] p-8 sm:p-12 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#5F6FFF]/15">
          
          {/* Subtle Decorative Background Shapes */}
          <div className="absolute -right-12 -top-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left Copy */}
          <div className="md:w-1/2 space-y-6 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Trusted Healthcare Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Book Appointment <br className="hidden sm:inline" />With 100+ Trusted Doctors
            </h1>

            <p className="text-sm sm:text-base text-blue-100 max-w-md mx-auto md:mx-0 font-normal leading-relaxed">
              Simply browse through our extensive list of verified medical specialists and schedule your consultation in seconds.
            </p>

            {/* Social Proof Avatars */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              <div className="flex -space-x-2">
                {doctorsData.slice(0, 3).map((doc, idx) => (
                  <img
                    key={idx}
                    src={doc.image}
                    alt={doc.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-xs text-blue-100 font-medium">
                Over <strong className="text-white font-bold">10,000+</strong> happy patients served
              </span>
            </div>

            {/* Call to action button */}
            <div className="pt-2">
              {user ? (
                <Link to="/patient">
                  <button className="bg-white text-[#5F6FFF] font-bold px-7 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-200 inline-flex items-center text-xs tracking-wide uppercase shadow-md shadow-black/5 hover:scale-[1.02]">
                    Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              ) : (
                <Link to="/register">
                  <button className="bg-white text-[#5F6FFF] font-bold px-7 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-200 inline-flex items-center text-xs tracking-wide uppercase shadow-md shadow-black/5 hover:scale-[1.02]">
                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Hero Doctor Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end z-10">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-white/10 rounded-[20px] blur-xl transform rotate-3" />
              <img
                src={doctorsData[0].image}
                alt="Mediqo Doctor Specialist"
                className="w-full h-auto max-h-96 object-cover object-top rounded-[20px] border-4 border-white/20 shadow-2xl relative z-10"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Specialities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#5F6FFF] uppercase tracking-wider">Medical Disciplines</span>
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
              className="group bg-white rounded-[12px] border border-slate-100 hover:border-[#5F6FFF]/40 hover:-translate-y-1 hover:shadow-md hover:shadow-[#5F6FFF]/5 transition-all duration-200 p-6 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#F0F3FF] group-hover:bg-[#5F6FFF] text-[#5F6FFF] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs">
                {getSpecialityIcon(item.iconName)}
              </div>
              <p className="text-xs font-bold text-slate-700 group-hover:text-[#5F6FFF] transition-colors leading-tight">
                {item.speciality}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-semibold text-[#5F6FFF] uppercase tracking-wider">Verified Practitioners</span>
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
              to={user ? `/patient/book?doctorId=${doc._id}` : '/login'}
              className="group bg-white rounded-[12px] border border-slate-200/80 hover:border-[#5F6FFF]/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#5F6FFF]/5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-[#EAEEFF] relative overflow-hidden flex items-end justify-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Available</span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#5F6FFF] transition-colors leading-tight">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {doc.speciality}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {doc.degree} • {doc.experience}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Consultation Fee</span>
                  <span className="text-xs font-extrabold text-slate-900">₹{doc.fees}</span>
                </div>
                <span className="text-xs font-semibold text-[#5F6FFF] group-hover:translate-x-0.5 transition-transform">
                  Book Visit →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/doctors">
            <button className="bg-[#F0F3FF] text-[#5F6FFF] font-bold px-8 py-3 rounded-full hover:bg-[#E2E8FF] transition-colors text-xs uppercase tracking-wider">
              More Doctors
            </button>
          </Link>
        </div>
      </section>

      {/* Bottom Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#5F6FFF] rounded-[24px] p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#5F6FFF]/10">
          
          <div className="space-y-4 md:w-2/3 text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Book Appointment <br />With 100+ Trusted Doctors
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md">
              Create an account or sign in to schedule your consultation with experienced medical staff in under 1 minute.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <button className="bg-white text-[#5F6FFF] font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-all text-xs uppercase tracking-wider shadow-md hover:scale-105">
                  Create Account
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center z-10">
            <img
              src={doctorsData[1].image}
              alt="Doctor consultation"
              className="h-56 object-cover object-top rounded-[16px] border-4 border-white/20 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Feature / Location Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[16px] border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 shadow-2xs">
          
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center shrink-0 border border-[#D6DDFF]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Mediqo Care Centers</p>
              <p className="text-[11px] text-slate-500">Mumbai, Bengaluru, Delhi & Chennai</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center shrink-0 border border-[#D6DDFF]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Direct Patient Support</p>
              <p className="text-[11px] text-slate-500">+1 (800) 555-MEDIQO</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-[#F0F3FF] text-[#5F6FFF] flex items-center justify-center shrink-0 border border-[#D6DDFF]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Clinic Hours</p>
              <p className="text-[11px] text-slate-500">Mon - Sat: 8:00 AM - 8:00 PM</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};


