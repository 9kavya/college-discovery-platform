"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        const validationMessage = err.errors.map((e) => e.message).join(', ');
        return res.status(400).json({
            status: 'error',
            message: validationMessage || 'Validation failed',
            errors,
        });
    }
    console.error('Unhandled Error:', err);
    return res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        stack: err.stack,
    });
};
exports.errorHandler = errorHandler;
