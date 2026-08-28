"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRoutes = void 0;
const express_1 = require("express");
const categories_controller_1 = require("./categories.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const roleGuard_1 = require("../../shared/guards/roleGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.categoriesRoutes = (0, express_1.Router)();
// Qualquer usuário autenticado pode visualizar categorias (precisa pra cadastrar produto).
exports.categoriesRoutes.use(authGuard_1.authGuard);
exports.categoriesRoutes.get("/", (0, asyncHandler_1.asyncHandler)(categories_controller_1.categoriesController.list));
exports.categoriesRoutes.get("/:id", (0, asyncHandler_1.asyncHandler)(categories_controller_1.categoriesController.getById));
// Criar/editar/excluir categoria é ação administrativa.
exports.categoriesRoutes.post("/", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(categories_controller_1.categoriesController.create));
exports.categoriesRoutes.patch("/:id", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(categories_controller_1.categoriesController.update));
exports.categoriesRoutes.delete("/:id", (0, roleGuard_1.roleGuard)(["ADMIN"]), (0, asyncHandler_1.asyncHandler)(categories_controller_1.categoriesController.delete));
//# sourceMappingURL=categories.routes.js.map