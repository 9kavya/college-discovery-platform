import { z } from 'zod';

export const questionSchema = z.object({
  content: z.string().min(5, 'Question must be at least 5 characters long').max(1000, 'Question cannot exceed 1000 characters'),
  userName: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional(),
});

export const answerSchema = z.object({
  content: z.string().min(5, 'Answer must be at least 5 characters long').max(2000, 'Answer cannot exceed 2000 characters'),
  userName: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional(),
});
