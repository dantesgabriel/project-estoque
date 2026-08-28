"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersRoutes = void 0;
const express_1 = require("express");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
const suppliers_controller_1 = require("./suppliers.controller");
exports.suppliersRoutes = (0, express_1.Router)();
exports.suppliersRoutes.use(authGuard_1.authGuard);
exports.suppliersRoutes.get("/", (0, asyncHandler_1.asyncHandler)(suppliers_controller_1.suppliersController.list));
exports.suppliersRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(suppliers_controller_1.suppliersController.getById));
exports.suppliersRoutes.post("/", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(suppliers_controller_1.suppliersController.create));
exports.suppliersRoutes.patch("/:id", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(suppliers_controller_1.suppliersController.update));
exports.suppliersRoutes.delete("/:id", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(suppliers_controller_1.suppliersController.delete));
//# sourceMappingURL=suppliers.routes.js.map