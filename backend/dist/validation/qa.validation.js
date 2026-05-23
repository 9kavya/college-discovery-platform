"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerSchema = exports.questionSchema = void 0;
const zod_1 = require("zod");
exports.questionSchema = zod_1.z.object({
    content: zod_1.z.string().min(5, 'Question must be at least 5 characters long').max(1000, 'Question cannot exceed 1000 characters'),
    userName: zod_1.z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional(),
});
exports.answerSchema = zod_1.z.object({
    content: zod_1.z.string().min(5, 'Answer must be at least 5 characters long').max(2000, 'Answer cannot exceed 2000 characters'),
    userName: zod_1.z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional(),
});
