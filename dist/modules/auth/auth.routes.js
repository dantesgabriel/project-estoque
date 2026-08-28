"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.authRoutes = (0, express_1.Router)();
// Rota pública — não passa por authGuard.
exports.authRoutes.post("/login", (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.login));
// Precisa estar logado, mas qualquer papel pode trocar a própria senha.
exports.authRoutes.post("/change-password", authGuard_1.authGuard, (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.changePassword));
//# sourceMappingURL=auth.routes.js.map