import { Request, Response } from "express";
import { productsService } from "./products.service";
import { createProductSchema, listProductsQuerySchema, updateProductSchema } from "./products.schema";

export const productsController = {
  async list(req: Request, res: Response) {
    const filters = listProductsQuerySchema.parse(req.query);
    const products = await productsService.list(filters);
    return res.json(products);
  },

  async getById(req: Request, res: Response) {
    const product = await productsService.getById(req.params.id);
    return res.json(product);
  },

  async create(req: Request, res: Response) {
    const input = createProductSchema.parse(req.body);
    const product = await productsService.create(input);
    return res.status(201).json(product);
  },

  async update(req: Request, res: Response) {
    const input = updateProductSchema.parse(req.body);
    const product = await productsService.update(req.params.id, input);
    return res.json(product);
  },
};