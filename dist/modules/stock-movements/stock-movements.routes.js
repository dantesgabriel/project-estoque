"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementsRoutes = void 0;
const express_1 = require("express");
const stock_movements_controller_1 = require("./stock-movements.controller");
const authGuard_1 = require("../../shared/guards/authGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.stockMovementsRoutes = (0, express_1.Router)();
// Admin e Funcionário podem registrar movimentação (seção 6: funcionário pode
// "registrar entradas/saídas, caso autorizado" — no MVP liberamos para ambos os
// papéis autenticados; refinar para permissão por-usuário fica pra Fase 2 se necessário).
exports.stockMovementsRoutes.use(authGuard_1.authGuard);
exports.stockMovementsRoutes.get("/", (0, asyncHandler_1.asyncHandler)(stock_movements_controller_1.stockMovementsController.list));
exports.stockMovementsRoutes.post("/entrada", (0, asyncHandler_1.asyncHandler)(stock_movements_controller_1.stockMovementsController.createEntry));
exports.stockMovementsRoutes.post("/saida", (0, asyncHandler_1.asyncHandler)(stock_movements_controller_1.stockMovementsController.createExit));
//# sourceMappingURL=stock-movements.routes.js.map