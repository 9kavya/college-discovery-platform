'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { College } from '../../types';
import { useCompare } from '../../hooks/useCompare';
import { Skeleton } from '../../components/UI/Skeleton';
import { toast } from '../../components/UI/Toast';
import { Scale, Star, Trash2, IndianRupee, MapPin, Building, Award, Calendar, BookOpen, Check, GraduationCap } from 'lucide-react';

export default function CompareCollegesPage() {
  const { comparedColleges, removeCollegeFromCompare, clearComparison } = useCompare();
  const [detailedColleges, setDetailedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetailedColleges = async () => {
      if (comparedColleges.length === 0) {
        setDetailedColleges([]);
        return;
      }
      setLoading(true);
      try {
        const details = await Promise.all(
          comparedColleges.map((c) =>
            api.getCollegeById(c.id).then((res) => res.data.college)
          )
        );
        setDetailedColleges(details);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load detailed college comparisons');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedColleges();
  }, [comparedColleges]);

  if (comparedColleges.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Scale className="h-16 w-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Compare Colleges</h1>
        <p className="text-gray-500 mt-2.5 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
          You need to select at least <span className="font-bold text-primary-600">2 colleges</span> to compare. Explore our list and add colleges to get started.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/colleges"
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all shadow-premium hover:shadow-lg"
          >
            Explore Colleges
          </Link>
        </div>
      </div>
    );
  }

  // Find winner values to highlight best performing metrics
  const minFees = Math.min(...detailedColleges.map((c) => c.fees));
  const maxRating = Math.max(...detailedColleges.map((c) => c.rating));
  const maxPlacement = Math.max(...detailedColleges.map((c) => c.placementRate));

  const formatFees = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Compare Colleges</h1>
          <p className="text-sm text-gray-500 mt-1">Analyzing and comparing top choice institutions side-by-side.</p>
        </div>
        <button
          onClick={clearComparison}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 rounded-xl px-3 py-2 bg-red-50/55 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton variant="rect" className="h-10" />
            <Skeleton variant="rect" className="h-10" />
            <Skeleton variant="rect" className="h-10" />
            <Skeleton variant="rect" className="h-10" />
          </div>
          <Skeleton variant="rect" className="h-[400px]" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-150 rounded-3xl bg-white shadow-premium">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/75">
                {/* Attribute header column */}
                <th className="p-5 text-xs font-extrabold uppercase text-gray-400 w-1/4">Comparison Matrix</th>
                {detailedColleges.map((col) => (
                  <th key={col.id} className="p-5 w-1/4">
                    <div className="relative group/header">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeCollegeFromCompare(col.id)}
                        className="absolute -top-1 right-0 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                      <div className="h-28 overflow-hidden rounded-xl bg-gray-100 border border-gray-150 mb-3.5 flex items-center justify-center relative group/banner">
                        {/* Zoomable Background */}
                        <div
                          style={{
                            backgroundImage: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(234, 88, 12, 0.95) 100%), url("/images/college_placeholder.svg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          className="absolute inset-0 group-hover/banner:scale-105 transition-transform duration-500"
                        />
                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center select-none text-white z-10 pointer-events-none">
                          <span className="text-[10px] font-extrabold line-clamp-2 leading-tight px-1">
                            {col.name}
                          </span>
                        </div>
                      </div>
                      <Link href={`/colleges/${col.id}`}>
                        <h3 className="font-extrabold text-sm text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 pr-6">
                          {col.name}
                        </h3>
                      </Link>
                      <span className="text-[10px] text-gray-500 mt-1 font-semibold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> {col.location}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {/* Average Tuition Fees */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <IndianRupee className="h-4.5 w-4.5 text-gray-400" />
                  <span>Annual Average Fees</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900">{formatFees(col.fees)} / yr</span>
                      {col.fees === minFees && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Best Value
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Placements Rate */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-gray-400" />
                  <span>Placement Rate</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5">
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold ${col.placementRate === maxPlacement ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {col.placementRate}%
                      </span>
                      {col.placementRate === maxPlacement && (
                        <span className="bg-emerald-50 text-emerald-750 border border-emerald-200 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Highest
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Overall Rating */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-gray-400" />
                  <span>Overall Rating</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{col.rating ? col.rating.toFixed(1) : 'N/A'}</span>
                      </span>
                      {col.rating === maxRating && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Top Rated
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Established Year */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-gray-400" />
                  <span>Year Established</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5 text-gray-700 font-semibold">
                    {col.established}
                  </td>
                ))}
              </tr>

              {/* Courses Offered */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-gray-400" />
                  <span>Popular Courses</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5">
                    <ul className="space-y-1 text-xs text-gray-600 font-medium">
                      {col.courses && col.courses.length > 0 ? (
                        col.courses.slice(0, 3).map((course) => (
                          <li key={course.id} className="list-disc ml-4">
                            {course.name}
                          </li>
                        ))
                      ) : (
                        <li>No popular courses listed</li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Campus Facilities */}
              <tr>
                <td className="p-5 font-bold text-gray-500 flex items-center gap-2">
                  <Building className="h-4.5 w-4.5 text-gray-400" />
                  <span>Key Facilities</span>
                </td>
                {detailedColleges.map((col) => (
                  <td key={col.id} className="p-5">
                    <div className="flex flex-wrap gap-1">
                      {col.facilities.slice(0, 4).map((fac) => (
                        <span key={fac} className="bg-gray-105 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-gray-200">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
