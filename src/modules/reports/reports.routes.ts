import { Router } from "express";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { reportsController } from "./reports.controller";

export const reportsRoutes = Router();
reportsRoutes.use(authGuard);
reportsRoutes.get("/movements", asyncHandler(reportsController.movements));
reportsRoutes.get("/adjustments", asyncHandler(reportsController.adjustments));
reportsRoutes.get("/appointment-consumption", asyncHandler(reportsController.consumption));
