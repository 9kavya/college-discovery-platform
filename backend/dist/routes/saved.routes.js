"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saved_controller_1 = require("../controllers/saved.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // Protect all routes in this file
router.get('/', saved_controller_1.getSavedColleges);
router.post('/:id', saved_controller_1.saveCollege);
router.delete('/:id', saved_controller_1.unsaveCollege);
exports.default = router;
