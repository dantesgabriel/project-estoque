"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRoutes = void 0;
const express_1 = require("express");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
const appointments_controller_1 = require("./appointments.controller");
exports.appointmentsRoutes = (0, express_1.Router)();
exports.appointmentsRoutes.use(authGuard_1.authGuard);
exports.appointmentsRoutes.get("/responsibles", (0, asyncHandler_1.asyncHandler)(appointments_controller_1.appointmentsController.listResponsibleUsers));
exports.appointmentsRoutes.get("/", (0, asyncHandler_1.asyncHandler)(appointments_controller_1.appointmentsController.list));
exports.appointmentsRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(appointments_controller_1.appointmentsController.getById));
exports.appointmentsRoutes.post("/", (0, asyncHandler_1.asyncHandler)(appointments_controller_1.appointmentsController.create));
exports.appointmentsRoutes.post("/:id/cancel", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(appointments_controller_1.appointmentsController.cancel));
//# sourceMappingURL=appointments.routes.js.map