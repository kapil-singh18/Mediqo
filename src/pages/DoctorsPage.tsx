import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doctorsData, specialityData } from '../assets/assets';
import { Button } from '../components/Button';
import { Search, Stethoscope, CheckCircle, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const DoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpeciality = searchParams.get('speciality') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const handleSpecialityFilter = (spec: string) => {
    if (selectedSpeciality === spec) {
      setSearchParams({});
    } else {
      setSearchParams({ speciality: spec });
    }
  };

  const filteredDoctors = doctorsData.filter((doc) => {
    const matchesSpec = selectedSpeciality ? doc.speciality === selectedSpeciality : true;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <p className="text-xs font-semibold text-[#5F6FFF] uppercase tracking-wider">Medical Directory</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Browse through the doctors specialist.
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctor or speciality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs focus:outline-none focus:border-[#5F6FFF] focus:ring-2 focus:ring-[#5F6FFF]/15"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Speciality Filter Sidebar */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 pb-2">Filter Specialities</p>
          
          <button
            onClick={() => setSearchParams({})}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              !selectedSpeciality
                ? 'bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Specialities ({doctorsData.length})
          </button>

          {specialityData.map((spec) => {
            const isSelected = selectedSpeciality === spec.speciality;
            return (
              <button
                key={spec.speciality}
                onClick={() => handleSpecialityFilter(spec.speciality)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#5F6FFF] text-white border-[#5F6FFF] shadow-md shadow-blue-500/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {spec.speciality}
              </button>
            );
          })}
        </div>

        {/* Doctors List Grid */}
        <div className="md:col-span-3">
          {filteredDoctors.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No doctors match your filter</h3>
              <p className="text-xs text-slate-500">Try selecting another specialty or clear your search term.</p>
              <Button size="sm" onClick={() => { setSearchParams({}); setSearchTerm(''); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <Link
                  key={doc._id}
                  to={user ? `/patient/book?doctorId=${doc._id}` : '/login'}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-[#5F6FFF]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
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
                    <span className="text-xs font-semibold text-[#5F6FFF]">Book Visit →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

