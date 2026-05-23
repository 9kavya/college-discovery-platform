'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../hooks/useCompare';
import { GraduationCap, Heart, Scale, User, LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { comparedColleges } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'glass shadow-md py-3' : 'bg-white border-b border-gray-100 py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">College<span className="text-primary-600">Discover</span></span>
              <p className="text-[10px] text-gray-500 font-medium leading-none">MVP Platform</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/colleges" className={`text-sm font-semibold transition-colors ${isActive('/colleges') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Explore Colleges
            </Link>
            <Link href="/compare" className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${isActive('/compare') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Scale className="h-4 w-4" />
              Compare
              {comparedColleges.length > 0 && (
                <span className="bg-secondary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {comparedColleges.length}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
                  <Heart className="h-4 w-4" />
                  Saved
                </Link>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors">
                    <div className="bg-gray-100 p-1.5 rounded-full text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <button onClick={logout} className="text-gray-500 hover:text-red-600 p-1 rounded-lg transition-colors" title="Logout">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-premium hover:shadow-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-4">
            {comparedColleges.length > 0 && (
              <Link href="/compare" className="relative p-1.5 text-gray-600 hover:text-gray-900">
                <Scale className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {comparedColleges.length}
                </span>
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3 shadow-inner">
          <Link
            href="/colleges"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${isActive('/colleges') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Explore Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold ${isActive('/compare') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              <span>Compare Colleges</span>
            </div>
            {comparedColleges.length > 0 && (
              <span className="bg-secondary-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {comparedColleges.length}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold ${isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Heart className="h-5 w-5" />
                <span>Saved Colleges</span>
              </Link>
              <div className="border-t border-gray-100 my-2 pt-2" />
              <div className="px-3 py-2 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-100 my-2 pt-2" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-lg text-base font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-premium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
