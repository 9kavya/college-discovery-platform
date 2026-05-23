'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Scale, ShieldCheck, Heart, Award, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/UI/Button';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/colleges?search=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="relative overflow-hidden bg-gray-50 pb-20">
      {/* Background Gradient Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-100 opacity-40 blur-[80px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary-100 opacity-30 blur-[100px] pointer-events-none" />

      {/* Hero Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 text-center">
        <div className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold mb-6 animate-fade-in shadow-sm">
          <Award className="h-3.5 w-3.5" />
          <span>India's Premium MVP College Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Discover Your Perfect College. <br className="hidden sm:inline" />
          <span className="text-primary-600 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Compare, Save & Review.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Inspired by Careers360 and Collegedunia. Search through top institutions, filter by annual fees, compare side-by-side, and save your favorites.
        </p>

        {/* Glassmorphic Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-10 max-w-3xl mx-auto glass p-3.5 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-grow flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-primary-500 transition-shadow">
            <Search className="h-5 w-5 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search by college name, e.g., IIT Bombay, BITS Pilani..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-full"
            />
          </div>
          <Button type="submit" variant="primary" className="py-3 px-6 sm:w-auto w-full font-semibold">
            Search Now
          </Button>
        </form>

        {/* Quick Categories */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs text-gray-400 font-bold self-center mr-2">POPULAR SEARCHES:</span>
          {['IIT', 'B.Tech', 'Karnataka', 'Andhra Pradesh', 'Hyderabad', 'Computer Science'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-200 text-xs font-semibold text-gray-600 hover:text-primary-700 px-3 py-1.5 rounded-xl transition-all shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-gray-150 p-8 rounded-3xl shadow-premium text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary-600">100+</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Top Colleges</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary-600">50+</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Degrees & Courses</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary-600">10k+</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Verified Reviews</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-primary-600">98%</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Placement Rate</p>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why Use CollegeDiscover?</h2>
          <p className="mt-2.5 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Everything you need to find, compare, and get admitted into your dream college in one simple screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Card 1: Explore & Search */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-premium hover:shadow-glass-hover transition-all duration-300">
            <div className="bg-primary-50 text-primary-600 p-3 rounded-xl inline-block mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Powerful Search & Filters</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Find colleges by names, filter immediately based on geographic location and tuition fee budgets. Infinite scrolling helps explore effortlessly.
            </p>
          </div>

          {/* Card 2: Compare Colleges */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-premium hover:shadow-glass-hover transition-all duration-300">
            <div className="bg-secondary-50 text-secondary-600 p-3 rounded-xl inline-block mb-4">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Compare Tool</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Select 2 to 3 colleges from search cards and view them side-by-side. Compare placement rates, tuition fees, location, and courses.
            </p>
          </div>

          {/* Card 3: Auth & Save */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-premium hover:shadow-glass-hover transition-all duration-300">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl inline-block mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Favorites & Auth Dashboard</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Create an account using secure JWT auth. Save your favorited colleges to a personalized dashboard for easy access anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison CTA Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-3xl bg-gray-900 overflow-hidden shadow-2xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center gap-8 border border-gray-800">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-gray-900 to-gray-900 pointer-events-none" />

          <div className="relative z-10 md:w-1/2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-100 bg-secondary-700/20 border border-secondary-600/30 px-3 py-1 rounded-full">
              Decision Helper Tool
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Unsure which college is right for you?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Select up to three colleges from our dashboard, and analyze their pricing, locations, and reviews side-by-side to make the absolute best decision.
            </p>
            <div className="pt-2">
              <Link href="/compare">
                <Button variant="secondary" className="font-bold flex items-center gap-2 py-3 px-6 rounded-xl group">
                  <span>Compare Colleges Now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-10 md:w-1/2 w-full flex justify-center">
            {/* Visual Design Element representing comparison matrix */}
            <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-5 shadow-2xl w-full max-w-md backdrop-blur-md">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-xs font-bold text-gray-400">Comparison Matrix</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="space-y-3.5 mt-4">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400 font-medium">Annual Fees</span>
                  <span className="text-white font-bold text-right">₹2.20L vs ₹4.75L</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400 font-medium">Placement Rate</span>
                  <span className="text-emerald-400 font-bold text-right">96.2% vs 92.5%</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400 font-medium">Rating</span>
                  <span className="text-white font-bold text-right flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.8 vs 4.6
                  </span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400 font-medium">Location</span>
                  <span className="text-white font-bold text-right">Mumbai vs Pilani</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
