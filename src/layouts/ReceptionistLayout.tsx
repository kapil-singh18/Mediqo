import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, LogOut, ChevronDown, Calendar, Users, Receipt, Home, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ReceptionistLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Reception Console', path: '/receptionist', icon: Home },
    { label: 'Patient Registry', path: '/receptionist/patients', icon: Users },
    { label: 'Appointments Desk', path: '/receptionist/appointments', icon: Calendar },
    { label: 'Billing & Invoices', path: '/receptionist/billing', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar Only - No Sidebar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Mediqo <span className="text-xs font-normal text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full ml-1">Reception Desk</span>
              </span>
            </Link>

            {/* Centered Nav Items */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                      active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                  {user?.name?.charAt(0) || 'R'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-[10px] text-purple-600 font-medium">Receptionist</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/receptionist/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 text-left border-b border-gray-100"
                  >
                    <UserIcon className="w-4 h-4 mr-2 text-purple-600" />
                    My Desk Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
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
