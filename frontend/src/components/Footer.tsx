import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-xl text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">College<span className="text-primary-500">Discover</span></span>
            </Link>
            <p className="text-sm text-gray-400">
              India's premium college exploration platform. Search, compare, and discover the best engineering, medical, and liberal arts programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/colleges" className="text-sm text-gray-400 hover:text-white transition-colors">Explore Colleges</Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-gray-400 hover:text-white transition-colors">Compare Tool</Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Login / Sign Up</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Locations</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mumbai, Maharashtra</li>
              <li>New Delhi, Delhi</li>
              <li>Tiruchirappalli, Tamil Nadu</li>
              <li>Vellore, Tamil Nadu</li>
            </ul>
          </div>

          {/* Contact and Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400">Subscribe for admission alerts and course guides.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                title="Subscribe to newsletter"
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-2 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} CollegeDiscover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
