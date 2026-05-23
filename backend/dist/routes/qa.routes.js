"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qa_controller_1 = require("../controllers/qa.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// /api/colleges/:id/questions
router.get('/:id/questions', qa_controller_1.getQuestions);
router.post('/:id/questions', auth_middleware_1.optionalProtect, qa_controller_1.createQuestion);
// /api/questions/:questionId/answers
router.post('/questions/:questionId/answers', auth_middleware_1.optionalProtect, qa_controller_1.createAnswer);
exports.default = router;
