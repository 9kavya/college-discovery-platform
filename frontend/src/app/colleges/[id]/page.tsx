'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../services/api';
import { College, Course, Review, Question, Answer } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useCompare } from '../../../hooks/useCompare';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { toast } from '../../../components/UI/Toast';
import { Skeleton } from '../../../components/UI/Skeleton';
import {
  MapPin,
  Star,
  Globe,
  Mail,
  Phone,
  Calendar,
  Layers,
  Heart,
  Scale,
  Award,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  GraduationCap,
  MessageCircle,
  Send,
  HelpCircle,
} from 'lucide-react';

export default function CollegeDetailPage() {
  const { id } = useParams() as { id: string };
  const { user, savedCollegeIds, toggleSaveCollege } = useAuth();
  const { comparedColleges, addCollegeToCompare, removeCollegeFromCompare } = useCompare();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews' | 'qa'>('overview');
  const [logoError, setLogoError] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Q&A Discussion state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionContent, setQuestionContent] = useState('');
  const [questionName, setQuestionName] = useState(user?.name || '');
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const [answerContents, setAnswerContents] = useState<Record<string, string>>({});
  const [answerNames, setAnswerNames] = useState<Record<string, string>>({});
  const [submittingAnswers, setSubmittingAnswers] = useState<Record<string, boolean>>({});
  const [visibleAnswerForms, setVisibleAnswerForms] = useState<Record<string, boolean>>({});

  const fetchCollegeDetails = useCallback(async () => {
    try {
      const res = await api.getCollegeById(id);
      if (res.status === 'success' && res.data?.college) {
        setCollege(res.data.college);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load college details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.getQuestions(id);
      if (res.status === 'success' && res.data?.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load Q&A discussion');
    } finally {
      setLoadingQuestions(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollegeDetails();
  }, [fetchCollegeDetails]);

  useEffect(() => {
    if (activeTab === 'qa') {
      fetchQuestions();
    }
  }, [activeTab, fetchQuestions]);

  // Autofill name if logged in
  useEffect(() => {
    if (user) {
      setReviewName(user.name);
      setQuestionName(user.name);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton variant="rect" className="h-64 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="text" className="w-1/2 h-8" />
            <Skeleton variant="text" className="w-3/4 h-5" />
            <Skeleton variant="rect" className="h-40 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton variant="rect" className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">College Not Found</h2>
        <p className="text-gray-500 mt-2">The college you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const isSaved = savedCollegeIds.includes(college.id);
  const isCompared = comparedColleges.some((c) => c.id === college.id);

  const handleFavoriteToggle = async () => {
    try {
      const added = await toggleSaveCollege(college.id);
      if (added) {
        toast.success(`Saved ${college.name} to favorites`);
      } else {
        toast.success(`Removed ${college.name} from favorites`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Please log in to save colleges');
    }
  };

  const handleCompareToggle = () => {
    if (isCompared) {
      removeCollegeFromCompare(college.id);
      toast.info(`Removed ${college.name} from comparison`);
    } else {
      const res = addCollegeToCompare(college);
      if (res.success) {
        toast.success(`Added ${college.name} to comparison`);
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first to submit a review');
      return;
    }
    if (comment.length < 5) {
      toast.error('Comment must be at least 5 characters long');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.submitReview(college.id, {
        rating,
        comment,
        userName: reviewName || user.name || 'Anonymous',
      });
      if (res.status === 'success') {
        toast.success('Review submitted successfully!');
        setComment('');
        fetchCollegeDetails(); // Refresh ratings/reviews list
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = user ? user.name : questionName.trim();
    if (!finalName) {
      toast.error('Please enter a display name');
      return;
    }
    if (finalName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    if (questionContent.trim().length < 5) {
      toast.error('Question must be at least 5 characters long');
      return;
    }

    setSubmittingQuestion(true);
    try {
      const res = await api.askQuestion(college.id, {
        content: questionContent.trim(),
        userName: finalName,
      });
      if (res.status === 'success') {
        toast.success('Question posted successfully!');
        setQuestionContent('');
        fetchQuestions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to post question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    const content = answerContents[questionId] || '';
    const finalName = user ? user.name : (answerNames[questionId] || '').trim();

    if (!finalName) {
      toast.error('Please enter a display name to reply');
      return;
    }
    if (finalName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }
    if (content.trim().length < 5) {
      toast.error('Answer must be at least 5 characters long');
      return;
    }

    setSubmittingAnswers((prev) => ({ ...prev, [questionId]: true }));
    try {
      const res = await api.answerQuestion(questionId, {
        content: content.trim(),
        userName: finalName,
      });
      if (res.status === 'success') {
        toast.success('Answer posted successfully!');
        setAnswerContents((prev) => ({ ...prev, [questionId]: '' }));
        setVisibleAnswerForms((prev) => ({ ...prev, [questionId]: false }));
        fetchQuestions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswers((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const toggleAnswerForm = (questionId: string) => {
    setVisibleAnswerForms((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
    if (user && !answerNames[questionId]) {
      setAnswerNames((prev) => ({ ...prev, [questionId]: user.name }));
    }
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="relative pb-20">
      {/* College Banner Background */}
      <div className="relative h-[300px] w-full bg-gray-900 overflow-hidden flex items-center justify-center group/banner">
        <div
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(17, 24, 39, 0.95) 50%, rgba(194, 65, 12, 0.95) 100%), url("/images/college_placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="absolute inset-0 opacity-85 group-hover/banner:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 pointer-events-none" />
      </div>

      {/* College Title Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Logo */}
          <div className="h-20 w-20 rounded-2xl overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center p-2 shrink-0 shadow-sm">
            {!logoError ? (
              <img
                src={college.logoUrl}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-full w-full bg-primary-100 flex items-center justify-center text-primary-700 font-extrabold text-2xl select-none">
                {college.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Title Info */}
          <div className="flex-grow space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary-50 text-primary-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Ranked #1
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{college.location}</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{college.rating ? college.rating.toFixed(1) : '0.0'} / 5</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{college.placementRate}% Placement</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700 font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                <Calendar className="h-3.5 w-3.5" />
                <span>Est. {college.established}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t border-gray-100 md:border-none pt-4 md:pt-0">
            <button
              onClick={handleCompareToggle}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                isCompared
                  ? 'bg-secondary-50 border-secondary-200 text-secondary-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Scale className="h-4.5 w-4.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={handleFavoriteToggle}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isSaved
                  ? 'bg-red-50 border border-red-100 text-red-600'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-premium'
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-red-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save College'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="border-b border-gray-200 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {(['overview', 'courses', 'placements', 'reviews', 'qa'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 capitalize ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'courses' ? 'Courses & Fees' : tab === 'qa' ? 'Q&A Discussion' : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Tab Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">About College</h2>
                  <p className="text-sm text-gray-500 leading-relaxed mt-3 whitespace-pre-line">
                    {college.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Campus Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="bg-gray-100 text-gray-800 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-gray-200/50"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900">Offered Courses</h2>
                {college.courses && college.courses.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-150 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-extrabold uppercase text-gray-500 border-b border-gray-150">
                          <th className="p-4">Course Name</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4 text-right">Annual Fees</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {college.courses.map((course) => (
                          <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-bold text-gray-900">{course.name}</td>
                            <td className="p-4 font-medium text-gray-500">{course.duration} Years</td>
                            <td className="p-4 text-right font-extrabold text-primary-600">
                              {formatCurrency(course.fees)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No courses listed at the moment.</p>
                )}
              </div>
            )}

            {activeTab === 'placements' && (
              <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900">Placements & Career Support</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-4">
                    <Award className="h-10 w-10 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Average Placement</span>
                      <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">{college.placementRate}%</p>
                    </div>
                  </div>
                  <div className="bg-primary-50/50 border border-primary-100 p-5 rounded-2xl flex items-center gap-4">
                    <TrendingUp className="h-10 w-10 text-primary-600 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Highest Package (Est)</span>
                      <p className="text-2xl font-extrabold text-primary-700 mt-0.5">₹45.0 LPA</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mt-4">
                  The college has a dedicated placement cell that acts as a bridge between academics and industry. Key recruiting partners visit the campus annually to offer top roles in technology, analytics, management, and consulting fields.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Write a Review Section */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium">
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span>Leave a Review</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Share your learning experience and campus feedback.</p>

                  <form onSubmit={handleReviewSubmit} className="space-y-4 mt-5">
                    {/* Stars Selector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating Score</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-500 focus:outline-none"
                          >
                            <Star
                              className={`h-7 w-7 ${
                                star <= rating ? 'fill-amber-500' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Reviewer Name"
                        placeholder="Your full name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        disabled={!!user} // Locked to auth user if logged in
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Comment</label>
                      <textarea
                        rows={4}
                        placeholder="What do you think about the campus, facilities, teaching staff, and placements?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="block w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="font-bold py-2.5 px-6 rounded-xl w-full sm:w-auto" isLoading={submittingReview}>
                      Submit Review
                    </Button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium space-y-6">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Student Reviews ({college.reviews?.length || 0})
                  </h2>

                  {college.reviews && college.reviews.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {college.reviews.map((rev) => (
                        <div key={rev.id} className="py-5 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">{rev.userName}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-550 text-white bg-amber-500 text-xs font-bold px-2 py-0.5 rounded-lg">
                              <Star className="h-3 w-3 fill-white text-white" />
                              <span>{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mt-2.5 whitespace-pre-line">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-4">No reviews yet. Be the first to leave one!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6">
                {/* Ask a Question Section */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium">
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary-500" />
                    <span>Ask a Question</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Have a query? Ask the community of alumni, current students, and staff.</p>

                  <form onSubmit={handleQuestionSubmit} className="space-y-4 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Display Name"
                        placeholder="Your full name"
                        value={questionName}
                        onChange={(e) => setQuestionName(e.target.value)}
                        disabled={!!user} // Locked to auth user if logged in
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Question Description</label>
                      <textarea
                        rows={4}
                        placeholder="Ask about admissions, courses, fees, placements, campus life, hostels, etc."
                        value={questionContent}
                        onChange={(e) => setQuestionContent(e.target.value)}
                        required
                        className="block w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="font-bold py-2.5 px-6 rounded-xl w-full sm:w-auto" isLoading={submittingQuestion}>
                      Post Question
                    </Button>
                  </form>
                </div>

                {/* Questions List */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-premium space-y-6">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Discussion Forum ({questions.length})
                  </h2>

                  {loadingQuestions ? (
                    <div className="space-y-4 py-4">
                      <Skeleton variant="text" className="w-1/3 h-5" />
                      <Skeleton variant="rect" className="w-full h-20 rounded-xl" />
                      <Skeleton variant="text" className="w-1/4 h-5" />
                      <Skeleton variant="rect" className="w-full h-20 rounded-xl" />
                    </div>
                  ) : questions.length > 0 ? (
                    <div className="divide-y divide-gray-150 space-y-6">
                      {questions.map((q) => (
                        <div key={q.id} className="pt-6 first:pt-0 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-primary-50 text-primary-700 rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm shrink-0">
                                  {q.userName.charAt(0).toUpperCase()}
                                </span>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{q.userName}</h4>
                                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                    {new Date(q.createdAt).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-850 text-gray-800 font-medium pl-10 leading-relaxed whitespace-pre-line">
                            {q.content}
                          </p>

                          {/* Answers nested list */}
                          <div className="pl-10 space-y-4">
                            {q.answers && q.answers.length > 0 && (
                              <div className="border-l-2 border-gray-100 pl-4 space-y-4 mt-2">
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  Answers ({q.answers.length})
                                </h5>
                                {q.answers.map((ans) => (
                                  <div key={ans.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-secondary-50 text-secondary-700 rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs shrink-0">
                                        {ans.userName.charAt(0).toUpperCase()}
                                      </span>
                                      <div>
                                        <h4 className="text-xs font-bold text-gray-900">{ans.userName}</h4>
                                        <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                          {new Date(ans.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pl-8">
                                      {ans.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Button and inline Answer Form */}
                            <div className="pt-2">
                              <button
                                onClick={() => toggleAnswerForm(q.id)}
                                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>{visibleAnswerForms[q.id] ? 'Cancel Answer' : 'Answer this question'}</span>
                              </button>

                              {visibleAnswerForms[q.id] && (
                                <form
                                  onSubmit={(e) => handleAnswerSubmit(e, q.id)}
                                  className="mt-3 bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3"
                                >
                                  <h4 className="text-xs font-extrabold text-gray-900">Post your answer</h4>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                      label="Display Name"
                                      placeholder="Your full name"
                                      value={answerNames[q.id] || ''}
                                      onChange={(e) =>
                                        setAnswerNames((prev) => ({
                                          ...prev,
                                          [q.id]: e.target.value,
                                        }))
                                      }
                                      disabled={!!user} // Locked to auth user if logged in
                                      required
                                      className="bg-white"
                                    />
                                  </div>

                                  <div className="w-full">
                                    <textarea
                                      rows={3}
                                      placeholder="Write your answer details here..."
                                      value={answerContents[q.id] || ''}
                                      onChange={(e) =>
                                        setAnswerContents((prev) => ({
                                          ...prev,
                                          [q.id]: e.target.value,
                                        }))
                                      }
                                      required
                                      className="block w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    />
                                  </div>

                                  <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    className="font-bold py-1.5 px-4 rounded-lg flex items-center gap-1.5"
                                    isLoading={submittingAnswers[q.id]}
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>Submit Answer</span>
                                  </Button>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No questions asked yet. Be the first to ask!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Sticky Contact info */}
          <aside className="col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-premium sticky top-28 space-y-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-150">
                Contact Information
              </h3>

              <div className="space-y-4 text-sm text-gray-600">
                <a
                  href={college.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-primary-600 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-450 text-primary-500 shrink-0" />
                  <span className="font-semibold text-xs line-clamp-1 flex items-center gap-1">
                    <span>Visit Website</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-xs truncate font-medium">{college.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-xs font-medium">{college.phone}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Average Annual Tuition</span>
                <p className="text-2xl font-extrabold text-primary-600 mt-1">
                  ₹{(college.fees / 100000).toFixed(2)} Lakhs <span className="text-xs font-semibold text-gray-500">/ yr</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
