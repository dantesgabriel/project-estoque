import { Router } from "express";
import { authController } from "./auth.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const authRoutes = Router();

// Rota pública — não passa por authGuard.
authRoutes.post("/login", asyncHandler(authController.login));

// Precisa estar logado, mas qualquer papel pode trocar a própria senha.
authRoutes.post("/change-password", authGuard, asyncHandler(authController.changePassword));
