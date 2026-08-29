import { Router } from "express";
import { authGuard } from "../../shared/guards/authGuard";
import { roleGuard } from "../../shared/guards/roleGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { appointmentsController } from "./appointments.controller";

export const appointmentsRoutes = Router();
appointmentsRoutes.use(authGuard);
appointmentsRoutes.get("/responsibles", asyncHandler(appointmentsController.listResponsibleUsers));
appointmentsRoutes.get("/", asyncHandler(appointmentsController.list));
appointmentsRoutes.get("/:id", asyncHandler(appointmentsController.getById));
appointmentsRoutes.post("/", asyncHandler(appointmentsController.create));
appointmentsRoutes.post("/:id/cancel", roleGuard(["ADMIN"]), asyncHandler(appointmentsController.cancel));
