import { Request, Response } from "express";
import { categoriesService } from "./categories.service";
import { createCategorySchema, updateCategorySchema } from "./categories.schema";

export const categoriesController = {
  async list(_req: Request, res: Response) {
    const categories = await categoriesService.list();
    return res.json(categories);
  },

  async getById(req: Request, res: Response) {
    const category = await categoriesService.getById(req.params.id);
    return res.json(category);
  },

  async create(req: Request, res: Response) {
    const input = createCategorySchema.parse(req.body);
    const category = await categoriesService.create(input);
    return res.status(201).json(category);
  },

  async update(req: Request, res: Response) {
    const input = updateCategorySchema.parse(req.body);
    const category = await categoriesService.update(req.params.id, input);
    return res.json(category);
  },

  async delete(req: Request, res: Response) {
    await categoriesService.delete(req.params.id);
    return res.status(204).send();
  },
};
