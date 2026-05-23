'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { College } from '../../types';
import { CollegeCard } from '../../components/CollegeCard';
import { Skeleton } from '../../components/UI/Skeleton';
import { toast } from '../../components/UI/Toast';
import { Heart, LogOut, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await api.getSavedColleges();
      if (res.status === 'success' && res.data?.colleges) {
        setSavedColleges(res.data.colleges);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load saved colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        fetchSaved();
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton variant="rect" className="h-20 rounded-2xl" />
        <Skeleton variant="rect" className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Dashboard greeting */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-premium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 text-primary-600 p-3.5 rounded-2xl">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your bookmarked colleges and read your reviews dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 rounded-xl px-4 py-2.5 bg-red-50/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <h2 className="text-lg font-bold text-gray-900">Saved Colleges ({savedColleges.length})</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rect" className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : savedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college) => (
              <CollegeCard key={college.id} college={college} onSavedChange={fetchSaved} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-premium max-w-lg mx-auto">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Saved Colleges</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              You haven't favorited any colleges yet. Explore the directory and bookmark institutions to keep track of them here.
            </p>
            <button
              onClick={() => router.push('/colleges')}
              className="mt-6 inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-premium"
            >
              <span>Explore Colleges</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
