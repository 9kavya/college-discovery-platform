import { Response, NextFunction } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../middleware/error.middleware';

export const getSavedColleges = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: req.user.id },
      include: {
        college: {
          include: {
            _count: {
              select: { reviews: true, courses: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const colleges = saved.map((s) => s.college);

    return res.status(200).json({
      status: 'success',
      data: {
        colleges,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveCollege = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: collegeId } = req.params;

    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return next(new AppError('College not found', 404));
    }

    const alreadySaved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    if (alreadySaved) {
      return res.status(200).json({
        status: 'success',
        message: 'College already in saved list',
      });
    }

    await prisma.savedCollege.create({
      data: {
        userId: req.user.id,
        collegeId,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'College saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const unsaveCollege = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: collegeId } = req.params;

    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const savedRecord = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    if (!savedRecord) {
      return next(new AppError('College is not saved', 404));
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: req.user.id,
          collegeId,
        },
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'College removed from saved list',
    });
  } catch (error) {
    next(error);
  }
};
