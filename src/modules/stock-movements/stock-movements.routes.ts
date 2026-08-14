import { Router } from "express";
import { stockMovementsController } from "./stock-movements.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const stockMovementsRoutes = Router();

// Admin e Funcionário podem registrar movimentação (seção 6: funcionário pode
// "registrar entradas/saídas, caso autorizado" — no MVP liberamos para ambos os
// papéis autenticados; refinar para permissão por-usuário fica pra Fase 2 se necessário).
stockMovementsRoutes.use(authGuard);

stockMovementsRoutes.get("/", asyncHandler(stockMovementsController.list));
stockMovementsRoutes.post("/entrada", asyncHandler(stockMovementsController.createEntry));
stockMovementsRoutes.post("/saida", asyncHandler(stockMovementsController.createExit));
