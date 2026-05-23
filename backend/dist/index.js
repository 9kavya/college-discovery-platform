"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const college_routes_1 = __importDefault(require("./routes/college.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
const qa_routes_1 = __importDefault(require("./routes/qa.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set([
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, '')));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        const normalizedOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.has(normalizedOrigin) ||
            normalizedOrigin.endsWith('.vercel.app') ||
            normalizedOrigin.startsWith('https://vercel.com') ||
            normalizedOrigin.startsWith('https://www.vercel.com');
        if (isAllowed) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/colleges', college_routes_1.default);
app.use('/api/saved', saved_routes_1.default);
app.use('/api/qa', qa_routes_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
