import { Request, Response } from "express";
import { usersService } from "./users.service";
import { createUserSchema, updateUserSchema } from "./users.schema";

export const usersController = {
  async create(req: Request, res: Response) {
    const input = createUserSchema.parse(req.body);
    const user = await usersService.create(input);
    return res.status(201).json(user);
  },

  async list(_req: Request, res: Response) {
    const users = await usersService.list();
    return res.json(users);
  },

  async getById(req: Request, res: Response) {
    const user = await usersService.getById(req.params.id);
    return res.json(user);
  },

  async update(req: Request, res: Response) {
    const input = updateUserSchema.parse(req.body);
    const user = await usersService.update(req.params.id, input);
    return res.json(user);
  },
};
