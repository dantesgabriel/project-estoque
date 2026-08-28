"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const AppError_1 = require("../errors/AppError");
// Último middleware da cadeia — captura qualquer erro lançado nos controllers/services.
function errorHandler(error, _req, res, _next) {
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Dados inválidos",
            issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor" });
}
//# sourceMappingURL=errorHandler.js.map