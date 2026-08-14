import { Request, Response } from "express";
import { inventoryService } from "./inventory.service";
import { countItemSchema, createInventorySchema } from "./inventory.schema";

export const inventoryController = {
  async list(_req: Request, res: Response) {
    const inventories = await inventoryService.list();
    return res.json(inventories);
  },

  async getById(req: Request, res: Response) {
    // Usa a versão "for counting" — respeita o modo cego escondendo expectedQty.
    const inventory = await inventoryService.getForCounting(req.params.id);
    return res.json(inventory);
  },

  async create(req: Request, res: Response) {
    const input = createInventorySchema.parse(req.body);
    const inventory = await inventoryService.create(input, req.user!.id);
    return res.status(201).json(inventory);
  },

  async submitCount(req: Request, res: Response) {
    const input = countItemSchema.parse(req.body);
    const item = await inventoryService.submitCount(req.params.id, req.params.itemId, input);
    return res.json(item);
  },

  async close(req: Request, res: Response) {
    const inventory = await inventoryService.close(req.params.id, req.user!.id);
    return res.json(inventory);
  },
};
