import { Router } from "express";
import { productsController } from "./products.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const productsRoutes = Router();

// Qualquer usuário autenticado pode visualizar produtos (funcionário precisa disso pra contagem).
productsRoutes.use(authGuard);

productsRoutes.get("/", asyncHandler(productsController.list));
// Deve ficar antes de /:id, ou "barcode" seria interpretado como um id de produto.
productsRoutes.get("/barcode/:barcode", asyncHandler(productsController.getByBarcode));
productsRoutes.get("/:id", asyncHandler(productsController.getById));

// Cadastro/edição de produto é ação administrativa (seção 6 do documento).
productsRoutes.post("/", roleGuard(["ADMIN"]), asyncHandler(productsController.create));
productsRoutes.patch("/:id", roleGuard(["ADMIN"]), asyncHandler(productsController.update));
productsRoutes.post("/:id/barcodes", roleGuard(["ADMIN", "FUNCIONARIO"]), asyncHandler(productsController.addBarcode));
