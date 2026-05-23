"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const auth_validation_1 = require("../validation/auth.validation");
const error_middleware_1 = require("../middleware/error.middleware");
const generateToken = (id, email, name) => {
    return jsonwebtoken_1.default.sign({ id, email, name }, process.env.JWT_SECRET || 'super-secret-dev-jwt-token-key-change-in-production', { expiresIn: '30d' });
};
const register = async (req, res, next) => {
    try {
        const validatedData = auth_validation_1.registerSchema.parse(req.body);
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return next(new error_middleware_1.AppError('User with this email already exists', 400));
        }
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        const token = generateToken(user.id, user.email, user.name);
        return res.status(201).json({
            status: 'success',
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const validatedData = auth_validation_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: { email: validatedData.email },
        });
        if (!user) {
            return next(new error_middleware_1.AppError('User not registered', 401));
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isPasswordCorrect) {
            return next(new error_middleware_1.AppError('Incorrect password', 401));
        }
        const token = generateToken(user.id, user.email, user.name);
        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new error_middleware_1.AppError('Not authenticated', 401));
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            return next(new error_middleware_1.AppError('User not found', 404));
        }
        return res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
