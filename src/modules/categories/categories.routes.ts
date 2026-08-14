import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const categoriesRoutes = Router();

// Qualquer usuário autenticado pode visualizar categorias (precisa pra cadastrar produto).
categoriesRoutes.use(authGuard);

categoriesRoutes.get("/", asyncHandler(categoriesController.list));
categoriesRoutes.get("/:id", asyncHandler(categoriesController.getById));

// Criar/editar/excluir categoria é ação administrativa.
categoriesRoutes.post("/", roleGuard(["ADMIN"]), asyncHandler(categoriesController.create));
categoriesRoutes.patch("/:id", roleGuard(["ADMIN"]), asyncHandler(categoriesController.update));
categoriesRoutes.delete("/:id", roleGuard(["ADMIN"]), asyncHandler(categoriesController.delete));
