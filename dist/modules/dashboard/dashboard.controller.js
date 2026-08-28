"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardController = {
    async getSummary(_req, res) {
        const summary = await dashboard_service_1.dashboardService.getSummary();
        return res.json(summary);
    },
};
//# sourceMappingURL=dashboard.controller.js.map