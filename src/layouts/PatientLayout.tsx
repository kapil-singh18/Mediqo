import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  LogOut,
  ChevronDown,
  Calendar,
  User,
  Clock,
  Home,
  FileText,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const PatientLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/patient', icon: Home },
    { label: 'Book Doctor', path: '/patient/book', icon: Calendar },
    { label: 'Appointments', path: '/patient/appointments', icon: Clock },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { label: 'Bills', path: '/patient/bills', icon: CreditCard },
    { label: 'My Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/patient" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#5F6FFF] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-100">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Mediqo
                </span>
                <span className="text-[10px] font-bold text-[#5F6FFF] uppercase tracking-wider -mt-1">
                  Patient Care
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-1.5 text-xs font-bold transition-all px-4 py-2 rounded-full ${
                      active
                        ? 'text-white bg-[#5F6FFF] shadow-xs'
                        : 'text-slate-600 hover:text-[#5F6FFF] hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-1.5 pr-3.5 rounded-full hover:bg-slate-100/80 transition-all border border-slate-200/80 bg-white shadow-2xs"
              >
                <img
                  src={
                    user?.profileImage ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={user?.name || 'Patient'}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-100"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[10px] font-semibold text-[#5F6FFF]">Patient Portal</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-xl border border-slate-100 py-3 z-50 space-y-1">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className="flex lg:hidden items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <item.icon className="w-4 h-4 mr-2 text-[#5F6FFF]" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
