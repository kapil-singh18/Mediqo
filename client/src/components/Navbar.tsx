import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stethoscope, Menu, X, User as UserIcon, LogOut, ChevronDown, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[10px] bg-[#5F6FFF] flex items-center justify-center text-white shadow-sm shadow-[#5F6FFF]/25 group-hover:bg-[#4D5CEB] transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Mediqo<span className="text-[#5F6FFF]">.</span>
              </span>
            </div>
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { label: 'Home', path: '/' },
              { label: 'All Doctors', path: '/doctors' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
            ].map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-1 text-xs font-semibold uppercase tracking-wider transition-all relative ${
                    active ? 'text-[#5F6FFF]' : 'text-slate-600 hover:text-[#5F6FFF]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5F6FFF] rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-[10px] hover:bg-slate-50 border border-slate-200 transition-all focus:outline-none"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#D6DDFF] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#F0F3FF] text-[#5F6FFF] font-bold text-xs flex items-center justify-center uppercase border border-[#D6DDFF] shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <span className="text-[10px] text-[#5F6FFF] font-semibold uppercase">{user.role}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-[12px] shadow-lg border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#F0F3FF] text-[#5F6FFF] text-[10px] font-bold rounded-full uppercase border border-[#D6DDFF]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardRoute(user.role as UserRole)}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F0F3FF] hover:text-[#5F6FFF] transition-colors"
                    >
                      <UserCheck className="w-4 h-4 mr-2.5 text-[#5F6FFF]" />
                      Dashboard Portal
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
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
              className="p-2 rounded-[10px] text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#5F6FFF]"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#5F6FFF]"
          >
            All Doctors
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#5F6FFF]"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-[#5F6FFF]"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-2 py-1 text-xs text-slate-500">
                  Signed in as <strong className="text-slate-800">{user.name}</strong> ({user.role})
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
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Book Appointment
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

