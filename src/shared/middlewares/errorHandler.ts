import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

// Último middleware da cadeia — captura qualquer erro lançado nos controllers/services.
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
