"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchesRoutes = exports.batchesController = void 0;
const express_1 = require("express");
const batches_repository_1 = require("./batches.repository");
const authGuard_1 = require("../../shared/guards/authGuard");
const asyncHandler_1 = require("../../shared/middlewares/asyncHandler");
exports.batchesController = {
    async listByProduct(req, res) {
        const batches = await batches_repository_1.batchesRepository.listByProduct(req.params.productId);
        return res.json(batches);
    },
};
exports.batchesRoutes = (0, express_1.Router)();
exports.batchesRoutes.use(authGuard_1.authGuard);
exports.batchesRoutes.get("/product/:productId", (0, asyncHandler_1.asyncHandler)(exports.batchesController.listByProduct));
//# sourceMappingURL=batches.routes.js.map