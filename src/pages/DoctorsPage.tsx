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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Mediqo Doctors Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse through specialized medical practitioners and book your appointment.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctor name or speciality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Speciality Filter Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs h-fit space-y-3">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm pb-2 border-b border-gray-100">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filter By Speciality</span>
          </div>

          <button
            onClick={() => setSearchParams({})}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              !selectedSpeciality ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Specialities ({doctorsData.length})
          </button>

          {specialityData.map((spec) => {
            const count = doctorsData.filter((d) => d.speciality === spec.speciality).length;
            const isSelected = selectedSpeciality === spec.speciality;
            return (
              <button
                key={spec.speciality}
                onClick={() => handleSpecialityFilter(spec.speciality)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected ? 'bg-blue-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{spec.speciality}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Doctors Grid */}
        <div className="lg:col-span-3">
          {filteredDoctors.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No Doctors Found</h3>
              <p className="text-xs text-gray-500">Try adjusting your search criteria or clearing filters.</p>
              <Button size="sm" onClick={() => { setSearchParams({}); setSearchTerm(''); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 bg-slate-100 relative">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top" />
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Available
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                        {doc.speciality}
                      </span>
                      <h3 className="text-base font-bold text-gray-900">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{doc.degree} • {doc.experience} Experience</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">{doc.about}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Consultation Fee</span>
                      <p className="text-base font-extrabold text-gray-900">${doc.fees}</p>
                    </div>
                    <Link to={user ? `/patient/book?doctorId=${doc._id}` : '/login'}>
                      <Button size="sm">Book Visit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
