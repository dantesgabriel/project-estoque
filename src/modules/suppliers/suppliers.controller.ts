import { Request, Response } from "express";
import { suppliersService } from "./suppliers.service";
import { createSupplierSchema, updateSupplierSchema } from "./suppliers.schema";

export const suppliersController = {
  async list(_req: Request, res: Response) { return res.json(await suppliersService.list()); },
  async getById(req: Request, res: Response) { return res.json(await suppliersService.getById(req.params.id)); },
  async create(req: Request, res: Response) { return res.status(201).json(await suppliersService.create(createSupplierSchema.parse(req.body))); },
  async update(req: Request, res: Response) { return res.json(await suppliersService.update(req.params.id, updateSupplierSchema.parse(req.body))); },
  async delete(req: Request, res: Response) { await suppliersService.delete(req.params.id); return res.status(204).send(); },
};
