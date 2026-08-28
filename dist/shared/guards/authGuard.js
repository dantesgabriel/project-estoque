"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../errors/AppError");
// Verifica o token JWT enviado em "Authorization: Bearer <token>".
// Qualquer rota que precise de usuário logado passa por aqui antes do controller.
function authGuard(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError_1.AppError("Token de autenticação ausente", 401);
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch {
        throw new AppError_1.AppError("Token inválido ou expirado", 401);
    }
}
//# sourceMappingURL=authGuard.js.map