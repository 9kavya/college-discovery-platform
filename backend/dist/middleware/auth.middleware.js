"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalProtect = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const prisma_1 = __importDefault(require("../prisma"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new error_middleware_1.AppError('Not authenticated. Please log in.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'super-secret-dev-jwt-token-key-change-in-production');
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return next(new error_middleware_1.AppError('User not found. Please log in again.', 401));
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new error_middleware_1.AppError('Invalid or expired token. Please log in again.', 401));
    }
};
exports.protect = protect;
const optionalProtect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'super-secret-dev-jwt-token-key-change-in-production');
            const user = await prisma_1.default.user.findUnique({
                where: { id: decoded.id },
            });
            if (user) {
                req.user = decoded;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalProtect = optionalProtect;
