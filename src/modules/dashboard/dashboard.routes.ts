import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const dashboardRoutes = Router();

// Qualquer usuário autenticado pode ver o dashboard (admin e funcionário).
dashboardRoutes.use(authGuard);
dashboardRoutes.get("/", asyncHandler(dashboardController.getSummary));
