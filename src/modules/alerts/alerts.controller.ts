import { Request, Response } from "express";
import { alertsService } from "./alerts.service";

export const alertsController = {
  async getSummary(_req: Request, res: Response) { return res.json(await alertsService.getCurrentAlerts()); },
};
