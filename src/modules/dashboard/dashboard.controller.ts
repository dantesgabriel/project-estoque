import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async getSummary(_req: Request, res: Response) {
    const summary = await dashboardService.getSummary();
    return res.json(summary);
  },
};
