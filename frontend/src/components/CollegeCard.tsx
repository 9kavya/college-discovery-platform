'use client';

import React from 'react';
import Link from 'next/link';
import { College } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../hooks/useCompare';
import { toast } from './UI/Toast';
import { Heart, Star, MapPin, CheckSquare, Square, GraduationCap } from 'lucide-react';

interface CollegeCardProps {
  college: College;
  onSavedChange?: () => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, onSavedChange }) => {
  const { user, savedCollegeIds, toggleSaveCollege } = useAuth();
  const { comparedColleges, addCollegeToCompare, removeCollegeFromCompare } = useCompare();

  const isSaved = savedCollegeIds.includes(college.id);
  const isCompared = comparedColleges.some((c) => c.id === college.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const added = await toggleSaveCollege(college.id);
      if (added) {
        toast.success(`Saved ${college.name} to favorites`);
      } else {
        toast.success(`Removed ${college.name} from favorites`);
      }
      if (onSavedChange) {
        onSavedChange();
      }
    } catch (err: any) {
      toast.error(err.message || 'Please log in to save colleges');
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeCollegeFromCompare(college.id);
      toast.info(`Removed ${college.name} from comparison`);
    } else {
      const res = addCollegeToCompare(college);
      if (res.success) {
        toast.success(`Added ${college.name} to compare list`);
      } else {
        toast.error(res.message);
      }
    }
  };

  // Format currency to Indian Rupees Lakhs (L) or Thousands (K)
  const formatFees = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${(value / 1000).toFixed(0)} K`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-premium hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      {/* College Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {/* Zoomable Background */}
        <div
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(234, 88, 12, 0.95) 100%), url("/images/college_placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none text-white z-10 pointer-events-none">
          <GraduationCap className="h-10 w-10 text-white/90 mb-2 animate-pulse" />
          <span className="text-white text-xs font-extrabold line-clamp-2 leading-snug px-2">
            {college.name}
          </span>
        </div>
        {/* Heart/Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-xl glass shadow-md hover:bg-white transition-all text-gray-700 hover:text-red-500 z-20"
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md z-20">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          <span>{college.rating ? college.rating.toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      {/* College Details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name and Location */}
        <div className="flex-1">
          <div className="flex items-start gap-1">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-500 font-semibold">{college.location}</span>
          </div>
          <Link href={`/colleges/${college.id}`}>
            <h3 className="text-base font-bold text-gray-900 mt-1.5 hover:text-primary-600 transition-colors line-clamp-2">
              {college.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {college.description}
          </p>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3.5 my-4 text-center">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Avg Fees</span>
            <p className="text-xs font-extrabold text-gray-900 mt-0.5">{formatFees(college.fees)}/yr</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Placements</span>
            <p className="text-xs font-extrabold text-emerald-600 mt-0.5">{college.placementRate}%</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Established</span>
            <p className="text-xs font-extrabold text-gray-900 mt-0.5">{college.established}</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          {/* Compare Checkbox Button */}
          <button
            onClick={handleCompareClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isCompared
                ? 'bg-secondary-50 border-secondary-200 text-secondary-700 shadow-sm'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isCompared ? (
              <CheckSquare className="h-4 w-4 text-secondary-500" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
            <span>Compare</span>
          </button>

          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold py-2 px-3 rounded-xl transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
