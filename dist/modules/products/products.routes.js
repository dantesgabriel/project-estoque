"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const products_controller_1 = require("./products.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.productsRoutes = (0, express_1.Router)();
// Qualquer usuário autenticado pode visualizar produtos (funcionário precisa disso pra contagem).
exports.productsRoutes.use(authGuard_1.authGuard);
exports.productsRoutes.get("/", (0, asyncHandler_1.asyncHandler)(products_controller_1.productsController.list));
exports.productsRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(products_controller_1.productsController.getById));
// Cadastro/edição de produto é ação administrativa (seção 6 do documento).
exports.productsRoutes.post("/", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(products_controller_1.productsController.create));
exports.productsRoutes.patch("/:id", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(products_controller_1.productsController.update));
//# sourceMappingURL=products.routes.js.map