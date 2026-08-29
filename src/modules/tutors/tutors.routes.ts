import { Router } from "express";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";
import { tutorsController } from "./tutors.controller";

export const tutorsRoutes = Router();
tutorsRoutes.use(authGuard);
tutorsRoutes.get("/", asyncHandler(tutorsController.list));
tutorsRoutes.get("/:id", asyncHandler(tutorsController.getById));
tutorsRoutes.post("/", asyncHandler(tutorsController.create));
tutorsRoutes.patch("/:id", asyncHandler(tutorsController.update));
tutorsRoutes.post("/:id/pets", asyncHandler(tutorsController.createPet));

export const petsRoutes = Router();
petsRoutes.use(authGuard);
petsRoutes.get("/:id", asyncHandler(tutorsController.getPet));
petsRoutes.patch("/:id", asyncHandler(tutorsController.updatePet));
