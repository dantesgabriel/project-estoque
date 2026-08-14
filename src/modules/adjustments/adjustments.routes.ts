import { Router } from "express";
import { adjustmentsController } from "./adjustments.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const adjustmentsRoutes = Router();

// Ajuste de estoque é sempre ação administrativa — envolve aprovar uma divergência
// e efetivamente corrigir o currentStock (seção 13 do documento).
adjustmentsRoutes.use(authGuard, roleGuard(["ADMIN"]));

adjustmentsRoutes.get("/", asyncHandler(adjustmentsController.list));
adjustmentsRoutes.post("/de-inventario", asyncHandler(adjustmentsController.createFromInventory));
adjustmentsRoutes.post("/manual", asyncHandler(adjustmentsController.createManual));
