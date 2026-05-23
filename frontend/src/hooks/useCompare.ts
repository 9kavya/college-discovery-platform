'use client';

import { useState, useEffect } from 'react';
import { College } from '../types';

export const useCompare = () => {
  const [comparedColleges, setComparedColleges] = useState<College[]>([]);

  const loadCompared = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compared_colleges');
      if (stored) {
        try {
          setComparedColleges(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('compared_colleges');
        }
      } else {
        setComparedColleges([]);
      }
    }
  };

  useEffect(() => {
    loadCompared();

    const handleCompareChange = () => {
      loadCompared();
    };

    window.addEventListener('compareChanged', handleCompareChange);
    return () => {
      window.removeEventListener('compareChanged', handleCompareChange);
    };
  }, []);

  const addCollegeToCompare = (college: College) => {
    if (comparedColleges.some((c) => c.id === college.id)) {
      return { success: false, message: 'College already added to comparison' };
    }
    if (comparedColleges.length >= 3) {
      return { success: false, message: 'You can compare a maximum of 3 colleges' };
    }
    const updated = [...comparedColleges, college];
    setComparedColleges(updated);
    localStorage.setItem('compared_colleges', JSON.stringify(updated));
    window.dispatchEvent(new Event('compareChanged'));
    return { success: true, message: 'Added to comparison' };
  };

  const removeCollegeFromCompare = (collegeId: string) => {
    const updated = comparedColleges.filter((c) => c.id !== collegeId);
    setComparedColleges(updated);
    localStorage.setItem('compared_colleges', JSON.stringify(updated));
    window.dispatchEvent(new Event('compareChanged'));
  };

  const clearComparison = () => {
    setComparedColleges([]);
    localStorage.removeItem('compared_colleges');
    window.dispatchEvent(new Event('compareChanged'));
  };

  return {
    comparedColleges,
    addCollegeToCompare,
    removeCollegeFromCompare,
    clearComparison,
  };
};
