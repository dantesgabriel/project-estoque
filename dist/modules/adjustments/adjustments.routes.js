"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustmentsRoutes = void 0;
const express_1 = require("express");
const adjustments_controller_1 = require("./adjustments.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.adjustmentsRoutes = (0, express_1.Router)();
// Ajuste de estoque é sempre ação administrativa — envolve aprovar uma divergência
// e efetivamente corrigir o currentStock (seção 13 do documento).
exports.adjustmentsRoutes.use(authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["ADMIN"]));
exports.adjustmentsRoutes.get("/", (0, asyncHandler_1.asyncHandler)(adjustments_controller_1.adjustmentsController.list));
exports.adjustmentsRoutes.post("/de-inventario", (0, asyncHandler_1.asyncHandler)(adjustments_controller_1.adjustmentsController.createFromInventory));
exports.adjustmentsRoutes.post("/manual", (0, asyncHandler_1.asyncHandler)(adjustments_controller_1.adjustmentsController.createManual));
//# sourceMappingURL=adjustments.routes.js.map