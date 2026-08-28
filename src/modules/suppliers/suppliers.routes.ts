import { Router } from "express";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { suppliersController } from "./suppliers.controller";

export const suppliersRoutes = Router();
suppliersRoutes.use(authGuard);
suppliersRoutes.get("/", asyncHandler(suppliersController.list));
suppliersRoutes.get("/:id", asyncHandler(suppliersController.getById));
suppliersRoutes.post("/", roleGuard(["ADMIN"]), asyncHandler(suppliersController.create));
suppliersRoutes.patch("/:id", roleGuard(["ADMIN"]), asyncHandler(suppliersController.update));
suppliersRoutes.delete("/:id", roleGuard(["ADMIN"]), asyncHandler(suppliersController.delete));
