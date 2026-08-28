"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.dashboardRoutes = (0, express_1.Router)();
// Qualquer usuário autenticado pode ver o dashboard (admin e funcionário).
exports.dashboardRoutes.use(authGuard_1.authGuard);
exports.dashboardRoutes.get("/", (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.getSummary));
//# sourceMappingURL=dashboard.routes.js.map