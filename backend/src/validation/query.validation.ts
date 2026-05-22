import { z } from 'zod';

export const collegeQuerySchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  minFees: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative().optional()),
  maxFees: z.preprocess((val) => (val ? Number(val) : undefined), z.number().nonnegative().optional()),
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().positive().optional().default(1)),
  limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().int().positive().optional().default(10)),
});
