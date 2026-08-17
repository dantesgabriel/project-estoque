import { PrismaClient } from "@prisma/client";

// Singleton — evita abrir múltiplas conexões durante hot-reload em dev.
export const prisma = new PrismaClient();
