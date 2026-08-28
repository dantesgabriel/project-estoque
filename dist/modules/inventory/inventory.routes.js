"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = void 0;
const express_1 = require("express");
const inventory_controller_1 = require("./inventory.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.inventoryRoutes = (0, express_1.Router)();
exports.inventoryRoutes.use(authGuard_1.authGuard);
exports.inventoryRoutes.get("/", (0, asyncHandler_1.asyncHandler)(inventory_controller_1.inventoryController.list));
exports.inventoryRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(inventory_controller_1.inventoryController.getById));
// Criar e fechar inventário: ação administrativa (seção 6).
exports.inventoryRoutes.post("/", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(inventory_controller_1.inventoryController.create));
exports.inventoryRoutes.post("/:id/close", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(inventory_controller_1.inventoryController.close));
// Contagem: admin e funcionário podem contar (seção 6 — funcionário "participa de inventários").
exports.inventoryRoutes.post("/:id/items/:itemId/count", (0, asyncHandler_1.asyncHandler)(inventory_controller_1.inventoryController.submitCount));
//# sourceMappingURL=inventory.routes.js.map