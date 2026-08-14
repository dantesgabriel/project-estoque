import { Request, Response } from "express";
import { authService } from "./auth.service";
import { loginSchema } from "./auth.schema";

export const authController = {
  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    return res.json(result);
  },
};
