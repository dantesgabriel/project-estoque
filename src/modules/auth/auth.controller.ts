import { Request, Response } from "express";
import { authService } from "./auth.service";
import { loginSchema } from "./auth.schema";
import { usersService } from "../users/users.service";
import { changePasswordSchema } from "../users/users.schema";

export const authController = {
  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    return res.json(result);
  },

  async changePassword(req: Request, res: Response) {
    const input = changePasswordSchema.parse(req.body);
    await usersService.changeOwnPassword(req.user!.id, input);
    return res.status(204).send();
  },
};
