import { Router } from "express";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { alertsController } from "./alerts.controller";

export const alertsRoutes = Router();
alertsRoutes.use(authGuard);
alertsRoutes.get("/summary", asyncHandler(alertsController.getSummary));
