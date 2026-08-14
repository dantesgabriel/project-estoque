import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UserRole } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

// Estende o Request do Express para carregar o usuário autenticado nas próximas camadas.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Verifica o token JWT enviado em "Authorization: Bearer <token>".
// Qualquer rota que precise de usuário logado passa por aqui antes do controller.
export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token de autenticação ausente", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      role: UserRole;
    };

    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
