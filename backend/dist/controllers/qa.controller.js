"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnswer = exports.createQuestion = exports.getQuestions = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const qa_validation_1 = require("../validation/qa.validation");
const error_middleware_1 = require("../middleware/error.middleware");
const getQuestions = async (req, res, next) => {
    try {
        const { id: collegeId } = req.params;
        const collegeExists = await prisma_1.default.college.findUnique({
            where: { id: collegeId },
        });
        if (!collegeExists) {
            return next(new error_middleware_1.AppError('College not found', 404));
        }
        const questions = await prisma_1.default.question.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getQuestions = getQuestions;
const createQuestion = async (req, res, next) => {
    try {
        const { id: collegeId } = req.params;
        const validatedData = qa_validation_1.questionSchema.parse(req.body);
        const collegeExists = await prisma_1.default.college.findUnique({
            where: { id: collegeId },
        });
        if (!collegeExists) {
            return next(new error_middleware_1.AppError('College not found', 404));
        }
        const userId = req.user?.id || null;
        const userName = req.user?.name || validatedData.userName || 'Anonymous';
        const question = await prisma_1.default.question.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createQuestion = createQuestion;
const createAnswer = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const validatedData = qa_validation_1.answerSchema.parse(req.body);
        const questionExists = await prisma_1.default.question.findUnique({
            where: { id: questionId },
        });
        if (!questionExists) {
            return next(new error_middleware_1.AppError('Question not found', 404));
        }
        const userId = req.user?.id || null;
        const userName = req.user?.name || validatedData.userName || 'Anonymous';
        const answer = await prisma_1.default.answer.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createAnswer = createAnswer;
