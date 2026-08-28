"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.usersRoutes = (0, express_1.Router)();
// Gestão de usuários é restrita a ADMIN (seção 6 do documento do projeto).
exports.usersRoutes.use(authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["ADMIN"]));
exports.usersRoutes.post("/", (0, asyncHandler_1.asyncHandler)(users_controller_1.usersController.create));
exports.usersRoutes.get("/", (0, asyncHandler_1.asyncHandler)(users_controller_1.usersController.list));
exports.usersRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(users_controller_1.usersController.getById));
exports.usersRoutes.patch("/:id", (0, asyncHandler_1.asyncHandler)(users_controller_1.usersController.update));
exports.usersRoutes.patch("/:id/password", (0, asyncHandler_1.asyncHandler)(users_controller_1.usersController.resetPassword));
//# sourceMappingURL=users.routes.js.map