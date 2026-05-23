'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { College } from '../../types';
import { CollegeCard } from '../../components/CollegeCard';
import { Skeleton } from '../../components/UI/Skeleton';
import { Search, MapPin, SlidersHorizontal, IndianRupee, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '../../components/UI/Toast';

export default function CollegeListingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get('search') || '';

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState('');
  const [maxFees, setMaxFees] = useState(600000);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setPage(1);
  }, [searchParams]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getColleges({
        search: search || undefined,
        location: location || undefined,
        maxFees,
        page,
        limit,
      });

      if (res.status === 'success' && res.data) {
        setColleges(res.data.colleges);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load colleges');
    } finally {
      setLoading(false);
    }
  }, [search, location, maxFees, page, limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchColleges();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [fetchColleges]);

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setMaxFees(600000);
    setPage(1);
    router.replace('/colleges');
  };

  const formatCurrency = (val: number) => {
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Colleges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Found <span className="font-bold text-primary-600">{total}</span> matching colleges across India
          </p>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-600 border border-gray-200 rounded-xl px-3 py-2 bg-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-premium sticky top-28">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-150 mb-5">
              <SlidersHorizontal className="h-4 w-4 text-primary-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Refine Search</h2>
            </div>

            <div className="space-y-2 mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase">Search by Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. BITS, IIT, engineering..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase">Location</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi..."
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <MapPin className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Karnataka', 'Andhra Pradesh', 'Hyderabad'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(location === loc ? '' : loc);
                      setPage(1);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                      location.toLowerCase().includes(loc.toLowerCase())
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                <span>Max Tuition Fees</span>
                <span className="text-primary-600 font-extrabold">{formatCurrency(maxFees)}/yr</span>
              </div>
              <input
                type="range"
                min={30000}
                max={600000}
                step={10000}
                value={maxFees}
                onChange={(e) => {
                  setMaxFees(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full accent-primary-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-1">
                <span>₹30k</span>
                <span>₹6.0L</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="col-span-1 lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                  <Skeleton variant="rect" className="h-44 rounded-xl" />
                  <Skeleton variant="text" className="w-1/3 h-3" />
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <Skeleton variant="text" className="w-full h-8" />
                  <div className="flex gap-2">
                    <Skeleton variant="text" className="w-1/2 h-8 rounded-lg" />
                    <Skeleton variant="text" className="w-1/2 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700 px-4">
                    Page <span className="font-bold text-gray-900">{page}</span> of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center shadow-premium">
              <IndianRupee className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-950">No Colleges Found</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                We couldn't find any colleges matching your search query or budget. Try resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-premium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
