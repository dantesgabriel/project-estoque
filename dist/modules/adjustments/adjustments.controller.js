"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustmentsController = void 0;
const adjustments_service_1 = require("./adjustments.service");
const adjustments_schema_1 = require("./adjustments.schema");
exports.adjustmentsController = {
    async list(_req, res) {
        const adjustments = await adjustments_service_1.adjustmentsService.list();
        return res.json(adjustments);
    },
    async createFromInventory(req, res) {
        const input = adjustments_schema_1.createAdjustmentFromInventorySchema.parse(req.body);
        const adjustment = await adjustments_service_1.adjustmentsService.createFromInventory(input, req.user.id);
        return res.status(201).json(adjustment);
    },
    async createManual(req, res) {
        const input = adjustments_schema_1.createManualAdjustmentSchema.parse(req.body);
        const adjustment = await adjustments_service_1.adjustmentsService.createManual(input, req.user.id);
        return res.status(201).json(adjustment);
    },
};
//# sourceMappingURL=adjustments.controller.js.map