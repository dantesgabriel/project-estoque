"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const users_routes_1 = require("./modules/users/users.routes");
const categories_routes_1 = require("./modules/categories/categories.routes");
const products_routes_1 = require("./modules/products/products.routes");
const stock_movements_routes_1 = require("./modules/stock-movements/stock-movements.routes");
const inventory_routes_1 = require("./modules/inventory/inventory.routes");
const adjustments_routes_1 = require("./modules/adjustments/adjustments.routes");
const dashboard_routes_1 = require("./modules/dashboard/dashboard.routes");
const batches_routes_1 = require("./modules/batches/batches.routes");
const suppliers_routes_1 = require("./modules/suppliers/suppliers.routes");
const errorHandler_1 = require("./shared/middlewares/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get("/health", (_req, res) => res.json({ status: "ok" }));
exports.app.use("/auth", auth_routes_1.authRoutes);
exports.app.use("/users", users_routes_1.usersRoutes);
exports.app.use("/categories", categories_routes_1.categoriesRoutes);
exports.app.use("/products", products_routes_1.productsRoutes);
exports.app.use("/stock-movements", stock_movements_routes_1.stockMovementsRoutes);
exports.app.use("/inventories", inventory_routes_1.inventoryRoutes);
exports.app.use("/adjustments", adjustments_routes_1.adjustmentsRoutes);
exports.app.use("/dashboard", dashboard_routes_1.dashboardRoutes);
exports.app.use("/batches", batches_routes_1.batchesRoutes);
exports.app.use("/suppliers", suppliers_routes_1.suppliersRoutes);
// Precisa ser o último app.use — captura erros de todas as rotas acima.
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map