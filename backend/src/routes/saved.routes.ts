import { Router } from 'express';
import { getSavedColleges, saveCollege, unsaveCollege } from '../controllers/saved.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes in this file

router.get('/', getSavedColleges);
router.post('/:id', saveCollege);
router.delete('/:id', unsaveCollege);

export default router;
