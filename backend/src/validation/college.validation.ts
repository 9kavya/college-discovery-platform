import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
});
