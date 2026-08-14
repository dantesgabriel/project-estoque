import { Router } from "express";
import { authController } from "./auth.controller";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const authRoutes = Router();

// Rota pública — não passa por authGuard.
authRoutes.post("/login", asyncHandler(authController.login));
