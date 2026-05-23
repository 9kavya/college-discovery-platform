"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.getCollegeById = exports.getColleges = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const query_validation_1 = require("../validation/query.validation");
const college_validation_1 = require("../validation/college.validation");
const error_middleware_1 = require("../middleware/error.middleware");
const getColleges = async (req, res, next) => {
    try {
        const query = query_validation_1.collegeQuerySchema.parse(req.query);
        const { search, location, minFees, maxFees, page, limit } = query;
        const skip = (page - 1) * limit;
        // Build the query filters
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                {
                    courses: {
                        some: {
                            name: { contains: search, mode: 'insensitive' },
                        },
                    },
                },
            ];
        }
        if (location) {
            whereClause.location = { contains: location, mode: 'insensitive' };
        }
        if (minFees !== undefined || maxFees !== undefined) {
            whereClause.fees = {};
            if (minFees !== undefined) {
                whereClause.fees.gte = minFees;
            }
            if (maxFees !== undefined) {
                whereClause.fees.lte = maxFees;
            }
        }
        const [colleges, total] = await Promise.all([
            prisma_1.default.college.findMany({
                where: whereClause,
                include: {
                    _count: {
                        select: { reviews: true, courses: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { rating: 'desc' },
            }),
            prisma_1.default.college.count({ where: whereClause }),
        ]);
        return res.status(200).json({
            status: 'success',
            data: {
                colleges,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getColleges = getColleges;
const getCollegeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const college = await prisma_1.default.college.findUnique({
            where: { id },
            include: {
                courses: true,
                reviews: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!college) {
            return next(new error_middleware_1.AppError('College not found', 404));
        }
        return res.status(200).json({
            status: 'success',
            data: {
                college,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCollegeById = getCollegeById;
const createReview = async (req, res, next) => {
    try {
        const { id: collegeId } = req.params;
        const validatedData = college_validation_1.reviewSchema.parse(req.body);
        const college = await prisma_1.default.college.findUnique({
            where: { id: collegeId },
        });
        if (!college) {
            return next(new error_middleware_1.AppError('College not found', 404));
        }
        // Check if user is authenticated and attach their userId
        const userId = req.user?.id || null;
        const review = await prisma_1.default.review.create({
            data: {
                rating: validatedData.rating,
                comment: validatedData.comment,
                userName: req.user?.name || validatedData.userName,
                userId,
                collegeId,
            },
        });
        // Recalculate average rating for the college
        const ratings = await prisma_1.default.review.aggregate({
            where: { collegeId },
            _avg: {
                rating: true,
            },
        });
        const averageRating = ratings._avg.rating ? parseFloat(ratings._avg.rating.toFixed(1)) : 0;
        await prisma_1.default.college.update({
            where: { id: collegeId },
            data: { rating: averageRating },
        });
        return res.status(201).json({
            status: 'success',
            data: {
                review,
                updatedRating: averageRating,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
