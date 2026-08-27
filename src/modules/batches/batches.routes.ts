import { Request, Response } from "express";
import { Router } from "express";
import { batchesRepository } from "./batches.repository";
import { authGuard } from "../../shared/guards/authGuard";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

export const batchesController = {
  async listByProduct(req: Request, res: Response) {
    const batches = await batchesRepository.listByProduct(req.params.productId);
    return res.json(batches);
  },
};

export const batchesRoutes = Router();

batchesRoutes.use(authGuard);
batchesRoutes.get("/product/:productId", asyncHandler(batchesController.listByProduct));
