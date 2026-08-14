import { Request, Response } from "express";
import { adjustmentsService } from "./adjustments.service";
import { createAdjustmentFromInventorySchema, createManualAdjustmentSchema } from "./adjustments.schema";

export const adjustmentsController = {
  async list(_req: Request, res: Response) {
    const adjustments = await adjustmentsService.list();
    return res.json(adjustments);
  },

  async createFromInventory(req: Request, res: Response) {
    const input = createAdjustmentFromInventorySchema.parse(req.body);
    const adjustment = await adjustmentsService.createFromInventory(input, req.user!.id);
    return res.status(201).json(adjustment);
  },

  async createManual(req: Request, res: Response) {
    const input = createManualAdjustmentSchema.parse(req.body);
    const adjustment = await adjustmentsService.createManual(input, req.user!.id);
    return res.status(201).json(adjustment);
  },
};
