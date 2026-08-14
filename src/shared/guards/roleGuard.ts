import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";

// Uso: router.post("/produtos", authGuard, roleGuard(["ADMIN"]), controller)
// Sempre usado DEPOIS do authGuard, pois depende de req.user já preenchido.
export function roleGuard(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Usuário não autenticado", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Você não tem permissão para essa ação", 403);
    }

    next();
  };
}
