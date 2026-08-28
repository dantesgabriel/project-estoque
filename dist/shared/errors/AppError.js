"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// Erro de negócio previsível (ex: email já cadastrado, credenciais inválidas).
// Diferente de um erro inesperado — este sempre vira uma resposta HTTP controlada.
class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map