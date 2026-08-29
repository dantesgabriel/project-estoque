"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petsRoutes = exports.tutorsRoutes = void 0;
const express_1 = require("express");
const authGuard_1 = require("../../shared/guards/authGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
const tutors_controller_1 = require("./tutors.controller");
exports.tutorsRoutes = (0, express_1.Router)();
exports.tutorsRoutes.use(authGuard_1.authGuard);
exports.tutorsRoutes.get("/", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.list));
exports.tutorsRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.getById));
exports.tutorsRoutes.post("/", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.create));
exports.tutorsRoutes.patch("/:id", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.update));
exports.tutorsRoutes.post("/:id/pets", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.createPet));
exports.petsRoutes = (0, express_1.Router)();
exports.petsRoutes.use(authGuard_1.authGuard);
exports.petsRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.getPet));
exports.petsRoutes.patch("/:id", (0, asyncHandler_1.asyncHandler)(tutors_controller_1.tutorsController.updatePet));
//# sourceMappingURL=tutors.routes.js.map