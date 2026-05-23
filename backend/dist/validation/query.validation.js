"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collegeQuerySchema = void 0;
const zod_1 = require("zod");
exports.collegeQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    minFees: zod_1.z.preprocess((val) => (val ? Number(val) : undefined), zod_1.z.number().nonnegative().optional()),
    maxFees: zod_1.z.preprocess((val) => (val ? Number(val) : undefined), zod_1.z.number().nonnegative().optional()),
    page: zod_1.z.preprocess((val) => (val ? Number(val) : 1), zod_1.z.number().int().positive().optional().default(1)),
    limit: zod_1.z.preprocess((val) => (val ? Number(val) : 10), zod_1.z.number().int().positive().optional().default(10)),
});
