import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { questionSchema, answerSchema } from '../validation/qa.validation';
import { AppError } from '../middleware/error.middleware';
import { AuthenticatedRequest } from '../types';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: collegeId } = req.params;

    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return next(new AppError('College not found', 404));
    }

    const questions = await prisma.question.findMany({
      where: { collegeId },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: collegeId } = req.params;
    const validatedData = questionSchema.parse(req.body);

    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return next(new AppError('College not found', 404));
    }

    const userId = req.user?.id || null;
    const userName = req.user?.name || validatedData.userName || 'Anonymous';

    const question = await prisma.question.create({
      data: {
        content: validatedData.content,
        userName,
        userId,
        collegeId,
      },
      include: {
        answers: true,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        question,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAnswer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { questionId } = req.params;
    const validatedData = answerSchema.parse(req.body);

    const questionExists = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!questionExists) {
      return next(new AppError('Question not found', 404));
    }

    const userId = req.user?.id || null;
    const userName = req.user?.name || validatedData.userName || 'Anonymous';

    const answer = await prisma.answer.create({
      data: {
        content: validatedData.content,
        userName,
        userId,
        questionId,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        answer,
      },
    });
  } catch (error) {
    next(error);
  }
};
