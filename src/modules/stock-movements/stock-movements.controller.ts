import { Request, Response } from "express";
import { stockMovementsService } from "./stock-movements.service";
import { createMovementSchema, listMovementsQuerySchema } from "./stock-movements.schema";

export const stockMovementsController = {
  async list(req: Request, res: Response) {
    const filters = listMovementsQuerySchema.parse(req.query);
    const movements = await stockMovementsService.list(filters);
    return res.json(movements);
  },

  async createEntry(req: Request, res: Response) {
    const input = createMovementSchema.parse(req.body);
    const movement = await stockMovementsService.createEntry(input, req.user!.id);
    return res.status(201).json(movement);
  },

  async createExit(req: Request, res: Response) {
    const input = createMovementSchema.parse(req.body);
    const movement = await stockMovementsService.createExit(input, req.user!.id);
    return res.status(201).json(movement);
  },
};
