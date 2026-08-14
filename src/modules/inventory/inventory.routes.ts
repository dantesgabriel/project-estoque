import { Router } from "express";
import { inventoryController } from "./inventory.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const inventoryRoutes = Router();

inventoryRoutes.use(authGuard);

inventoryRoutes.get("/", asyncHandler(inventoryController.list));
inventoryRoutes.get("/:id", asyncHandler(inventoryController.getById));

// Criar e fechar inventário: ação administrativa (seção 6).
inventoryRoutes.post("/", roleGuard(["ADMIN"]), asyncHandler(inventoryController.create));
inventoryRoutes.post("/:id/close", roleGuard(["ADMIN"]), asyncHandler(inventoryController.close));

// Contagem: admin e funcionário podem contar (seção 6 — funcionário "participa de inventários").
inventoryRoutes.post("/:id/items/:itemId/count", asyncHandler(inventoryController.submitCount));
