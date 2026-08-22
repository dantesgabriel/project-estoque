import { Router } from "express";
import { usersController } from "./users.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const usersRoutes = Router();

// Gestão de usuários é restrita a ADMIN (seção 6 do documento do projeto).
usersRoutes.use(authGuard, roleGuard(["ADMIN"]));

usersRoutes.post("/", asyncHandler(usersController.create));
usersRoutes.get("/", asyncHandler(usersController.list));
usersRoutes.get("/:id", asyncHandler(usersController.getById));
usersRoutes.patch("/:id", asyncHandler(usersController.update));
usersRoutes.patch("/:id/password", asyncHandler(usersController.resetPassword));
