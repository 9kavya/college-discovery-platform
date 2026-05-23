import React, { Suspense } from 'react';
import CollegeListingClient from './CollegeListingClient';

function CollegesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-premium">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <div className="h-44 rounded-xl bg-gray-200 animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-full rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegesLoading />}>
      <CollegeListingClient />
    </Suspense>
  );
}
