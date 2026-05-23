export interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  userId?: string;
  collegeId: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  description: string;
  location: string;
  fees: number;
  rating: number;
  placementRate: number;
  imageUrl: string;
  logoUrl: string;
  website: string;
  email: string;
  phone: string;
  established: number;
  facilities: string[];
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    courses: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollegeListResponse {
  status: string;
  data: {
    colleges: College[];
    pagination: Pagination;
  };
}

export interface CollegeDetailResponse {
  status: string;
  data: {
    college: College;
  };
}

export interface Answer {
  id: string;
  content: string;
  userName: string;
  userId?: string;
  questionId: string;
  createdAt: string;
}

export interface Question {
  id: string;
  content: string;
  userName: string;
  userId?: string;
  collegeId: string;
  createdAt: string;
  answers: Answer[];
}

