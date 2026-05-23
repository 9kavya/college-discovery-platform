"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveCollege = exports.saveCollege = exports.getSavedColleges = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const getSavedColleges = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new error_middleware_1.AppError('Not authenticated', 401));
        }
        const saved = await prisma_1.default.savedCollege.findMany({
            where: { userId: req.user.id },
            include: {
                college: {
                    include: {
                        _count: {
                            select: { reviews: true, courses: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const colleges = saved.map((s) => s.college);
        return res.status(200).json({
            status: 'success',
            data: {
                colleges,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSavedColleges = getSavedColleges;
const saveCollege = async (req, res, next) => {
    try {
        const { id: collegeId } = req.params;
        if (!req.user) {
            return next(new error_middleware_1.AppError('Not authenticated', 401));
        }
        const collegeExists = await prisma_1.default.college.findUnique({
            where: { id: collegeId },
        });
        if (!collegeExists) {
            return next(new error_middleware_1.AppError('College not found', 404));
        }
        const alreadySaved = await prisma_1.default.savedCollege.findUnique({
            where: {
                userId_collegeId: {
                    userId: req.user.id,
                    collegeId,
                },
            },
        });
        if (alreadySaved) {
            return res.status(200).json({
                status: 'success',
                message: 'College already in saved list',
            });
        }
        await prisma_1.default.savedCollege.create({
            data: {
                userId: req.user.id,
                collegeId,
            },
        });
        return res.status(201).json({
            status: 'success',
            message: 'College saved successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveCollege = saveCollege;
const unsaveCollege = async (req, res, next) => {
    try {
        const { id: collegeId } = req.params;
        if (!req.user) {
            return next(new error_middleware_1.AppError('Not authenticated', 401));
        }
        const savedRecord = await prisma_1.default.savedCollege.findUnique({
            where: {
                userId_collegeId: {
                    userId: req.user.id,
                    collegeId,
                },
            },
        });
        if (!savedRecord) {
            return next(new error_middleware_1.AppError('College is not saved', 404));
        }
        await prisma_1.default.savedCollege.delete({
            where: {
                userId_collegeId: {
                    userId: req.user.id,
                    collegeId,
                },
            },
        });
        return res.status(200).json({
            status: 'success',
            message: 'College removed from saved list',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.unsaveCollege = unsaveCollege;
