"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Singleton — evita abrir múltiplas conexões durante hot-reload em dev.
exports.prisma = new client_1.PrismaClient();
//# sourceMappingURL=prisma.js.map