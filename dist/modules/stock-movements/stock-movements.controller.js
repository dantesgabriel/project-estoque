"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementsController = void 0;
const stock_movements_service_1 = require("./stock-movements.service");
const stock_movements_schema_1 = require("./stock-movements.schema");
exports.stockMovementsController = {
    async list(req, res) {
        const filters = stock_movements_schema_1.listMovementsQuerySchema.parse(req.query);
        const movements = await stock_movements_service_1.stockMovementsService.list(filters);
        return res.json(movements);
    },
    async createEntry(req, res) {
        const input = stock_movements_schema_1.createMovementSchema.parse(req.body);
        const movement = await stock_movements_service_1.stockMovementsService.createEntry(input, req.user.id, req.user.role);
        return res.status(201).json(movement);
    },
    async createExit(req, res) {
        const input = stock_movements_schema_1.createMovementSchema.parse(req.body);
        const movement = await stock_movements_service_1.stockMovementsService.createExit(input, req.user.id);
        return res.status(201).json(movement);
    },
};
//# sourceMappingURL=stock-movements.controller.js.map