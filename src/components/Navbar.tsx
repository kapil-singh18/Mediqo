import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, Menu, X, User as UserIcon, LogOut, ChevronDown, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';
import { UserRole } from '../constants';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case UserRole.PATIENT:
        return '/patient';
      case UserRole.DOCTOR:
        return '/doctor';
      case UserRole.RECEPTIONIST:
        return '/receptionist';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5F6FFF] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Mediqo<span className="text-[#5F6FFF]">.</span>
              </span>
            </div>
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`py-1 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                isActive('/') ? 'text-[#5F6FFF]' : 'text-slate-700 hover:text-[#5F6FFF]'
              }`}
            >
              Home
              {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6FFF] rounded-full" />}
            </Link>
            <Link
              to="/doctors"
              className={`py-1 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                isActive('/doctors') ? 'text-[#5F6FFF]' : 'text-slate-700 hover:text-[#5F6FFF]'
              }`}
            >
              All Doctors
              {isActive('/doctors') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6FFF] rounded-full" />}
            </Link>
            <Link
              to="/about"
              className={`py-1 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                isActive('/about') ? 'text-[#5F6FFF]' : 'text-slate-700 hover:text-[#5F6FFF]'
              }`}
            >
              About
              {isActive('/about') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6FFF] rounded-full" />}
            </Link>
            <Link
              to="/contact"
              className={`py-1 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                isActive('/contact') ? 'text-[#5F6FFF]' : 'text-slate-700 hover:text-[#5F6FFF]'
              }`}
            >
              Contact
              {isActive('/contact') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F6FFF] rounded-full" />}
            </Link>
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</p>
                    <span className="text-[10px] text-blue-600 font-medium capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardRoute(user.role as UserRole)}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <UserCheck className="w-4 h-4 mr-2.5 text-blue-500" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-red-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Doctors
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-2 py-1 text-xs text-gray-500">
                  Signed in as <strong className="text-gray-800">{user.name}</strong> ({user.role})
                </div>
                <Link
                  to={getDashboardRoute(user.role as UserRole)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="secondary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="danger" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Register as Patient
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
