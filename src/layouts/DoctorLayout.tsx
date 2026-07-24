import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, LogOut, ChevronDown, Calendar, FileText, Clock, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const DoctorLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
    { label: 'Availability', path: '/doctor/availability', icon: Clock },
    { label: 'Profile', path: '/doctor/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar Only */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/doctor" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5F6FFF] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Mediqo <span className="text-xs font-semibold text-[#5F6FFF] bg-blue-50 px-2.5 py-0.5 rounded-full ml-1 border border-blue-100">Doctor Portal</span>
              </span>
            </Link>

            {/* Centered Nav Items */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path !== '/doctor' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-2 text-xs font-semibold transition-all px-3 py-2 rounded-xl ${
                      active ? 'text-[#5F6FFF] bg-blue-50/80 border border-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <div className="w-8 h-8 rounded-full bg-[#5F6FFF] text-white text-xs font-bold flex items-center justify-center uppercase shadow-xs">
                  {user?.name?.charAt(0) || 'D'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-[#5F6FFF] font-medium">{user?.speciality || 'Practitioner'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <Link
                    to="/doctor/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
                    My Profile
                  </Link>

                  <Link
                    to="/doctor/availability"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    Manage Availability
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
