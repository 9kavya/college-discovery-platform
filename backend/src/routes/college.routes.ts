import { Router } from 'express';
import { getColleges, getCollegeById, createReview } from '../controllers/college.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.post('/:id/reviews', protect, createReview);

export default router;
