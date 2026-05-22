import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { collegeQuerySchema } from '../validation/query.validation';
import { reviewSchema } from '../validation/college.validation';
import { AppError } from '../middleware/error.middleware';
import { AuthenticatedRequest } from '../types';

export const getColleges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = collegeQuerySchema.parse(req.query);
    const { search, location, minFees, maxFees, page, limit } = query;

    const skip = (page - 1) * limit;

    // Build the query filters
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        {
          courses: {
            some: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      whereClause.fees = {};
      if (minFees !== undefined) {
        whereClause.fees.gte = minFees;
      }
      if (maxFees !== undefined) {
        whereClause.fees.lte = maxFees;
      }
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: whereClause,
        include: {
          _count: {
            select: { reviews: true, courses: true },
          },
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      prisma.college.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        colleges,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCollegeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!college) {
      return next(new AppError('College not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        college,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: collegeId } = req.params;
    const validatedData = reviewSchema.parse(req.body);

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return next(new AppError('College not found', 404));
    }

    // Check if user is authenticated and attach their userId
    const userId = req.user?.id || null;

    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        userName: req.user?.name || validatedData.userName,
        userId,
        collegeId,
      },
    });

    // Recalculate average rating for the college
    const ratings = await prisma.review.aggregate({
      where: { collegeId },
      _avg: {
        rating: true,
      },
    });

    const averageRating = ratings._avg.rating ? parseFloat(ratings._avg.rating.toFixed(1)) : 0;

    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: averageRating },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        review,
        updatedRating: averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};
