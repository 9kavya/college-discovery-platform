import { Router } from 'express';
import { getQuestions, createQuestion, createAnswer } from '../controllers/qa.controller';
import { optionalProtect } from '../middleware/auth.middleware';

const router = Router();

// /api/colleges/:id/questions
router.get('/:id/questions', getQuestions);
router.post('/:id/questions', optionalProtect, createQuestion);

// /api/questions/:questionId/answers
router.post('/questions/:questionId/answers', optionalProtect, createAnswer);

export default router;
