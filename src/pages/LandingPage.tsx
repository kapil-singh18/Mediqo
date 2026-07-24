import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  Phone,
  CheckCircle,
  Sparkles,
  MapPin,
  HeartPulse,
  Baby,
  Activity,
} from 'lucide-react';
import { doctorsData, specialityData } from '../assets/assets';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-50 pt-12 pb-24 rounded-b-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100/60">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Next-Generation Healthcare</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Book Appointments With <span className="text-blue-600">100+ Trusted</span> Doctors
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Mediqo connects patients with certified medical specialists. Experience seamless queue tracking, instant consultation scheduling, and modern healthcare management.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {user ? (
                  <Link to="/patient">
                    <Button size="lg" className="px-8 shadow-xl shadow-blue-200 hover:scale-105">
                      Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="px-8 shadow-xl shadow-blue-200 hover:scale-105">
                        Book Appointment <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/doctors">
                      <Button variant="outline" size="lg" className="px-6 rounded-full border-slate-200">
                        Explore Doctors
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats badges */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100+</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Verified Doctors</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15+</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Speciality Clinics</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">99%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Patient Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white space-y-4 p-5 transform lg:rotate-2">
                  
                  <div className="relative rounded-2xl overflow-hidden h-80 bg-blue-50">
                    <img
                      src={doctorsData[0].image}
                      alt="Mediqo Chief Physician"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{doctorsData[0].name}</p>
                        <p className="text-[10px] text-blue-600 font-semibold">{doctorsData[0].speciality}</p>
                      </div>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle className="w-3 h-3 mr-1" /> Available Today
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Instant Queue Token</p>
                        <p className="text-[11px] text-slate-500">Zero waiting time consultation</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Mediqo Care</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Specialities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Medical Departments</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Doctor By Speciality</h3>
          <p className="text-sm text-slate-500">
            Select from our comprehensive range of specialized medical disciplines.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialityData.map((item) => (
            <Link
              key={item.speciality}
              to={`/doctors?speciality=${encodeURIComponent(item.speciality)}`}
              className="group bg-slate-50 rounded-2xl border border-slate-200/50 hover:border-blue-500/30 hover:bg-white hover:shadow-xl transition-all duration-300 p-6 text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100/60 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.speciality}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Top Specialists</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Doctors to Book</h3>
            <p className="text-sm text-slate-500 mt-1">Browse through our most recommended medical practitioners.</p>
          </div>
          <Link to="/doctors">
            <Button variant="outline" size="sm" className="rounded-full">
              View All Doctors ({doctorsData.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctorsData.slice(0, 3).map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                    Available
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/60">
                      {doc.speciality}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{doc.experience} exp</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{doc.about}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fee</span>
                  <p className="text-base font-extrabold text-slate-900">${doc.fees}</p>
                </div>
                <Link to={user ? '/patient' : '/login'}>
                  <Button size="sm">Book Appointment</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-blue-600 text-white py-16 rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="space-y-4">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              About Mediqo
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Leading Clinic Management & Patient Care Platform
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Mediqo simplifies healthcare interactions for patients, doctors, and clinic reception staff. Designed for efficiency, reliability, and modern medical standards.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-blue-200" />
                <span>Verified doctor credentials & specialty profiles</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-blue-200" />
                <span>Synchronized reception & practitioner queue</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h4 className="text-lg font-bold">Why Choose Mediqo?</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/10 p-3.5 rounded-xl">
                <p className="font-bold text-white">Instant Booking</p>
                <p className="text-blue-100 mt-1">Direct scheduling with top doctors.</p>
              </div>
              <div className="bg-white/10 p-3.5 rounded-xl">
                <p className="font-bold text-white">Zero Wait Times</p>
                <p className="text-blue-100 mt-1">Smart queue token numbers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Clinic Location</h4>
              <p className="text-xs text-gray-500 mt-1">
                Mediqo Healthcare Tower, 12th Avenue, Medical Hub, City Center
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Contact Desk</h4>
              <p className="text-xs text-gray-500 mt-1">Phone: +1 (800) 555-MEDI</p>
              <p className="text-xs text-gray-500">Email: care@mediqo.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Working Hours</h4>
              <p className="text-xs text-gray-500 mt-1">Mon - Sat: 08:00 AM - 08:00 PM</p>
              <p className="text-xs text-gray-500">Sunday: Emergency Consultations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
