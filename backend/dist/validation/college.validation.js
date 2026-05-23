"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: zod_1.z.string().min(5, 'Comment must be at least 5 characters'),
    userName: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
});
