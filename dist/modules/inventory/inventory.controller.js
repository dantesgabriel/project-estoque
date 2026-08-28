"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
const inventory_schema_1 = require("./inventory.schema");
exports.inventoryController = {
    async list(_req, res) {
        const inventories = await inventory_service_1.inventoryService.list();
        return res.json(inventories);
    },
    async getById(req, res) {
        // Usa a versão "for counting" — respeita o modo cego escondendo expectedQty.
        const inventory = await inventory_service_1.inventoryService.getForCounting(req.params.id);
        return res.json(inventory);
    },
    async create(req, res) {
        const input = inventory_schema_1.createInventorySchema.parse(req.body);
        const inventory = await inventory_service_1.inventoryService.create(input, req.user.id);
        return res.status(201).json(inventory);
    },
    async submitCount(req, res) {
        const input = inventory_schema_1.countItemSchema.parse(req.body);
        const item = await inventory_service_1.inventoryService.submitCount(req.params.id, req.params.itemId, input);
        return res.json(item);
    },
    async close(req, res) {
        const inventory = await inventory_service_1.inventoryService.close(req.params.id, req.user.id);
        return res.json(inventory);
    },
};
//# sourceMappingURL=inventory.controller.js.map