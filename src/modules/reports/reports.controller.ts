import { Request, Response } from "express";
import { adjustmentsReportQuerySchema, consumptionReportQuerySchema, movementsReportQuerySchema } from "./reports.schema";
import { reportsService } from "./reports.service";

export const reportsController = {
  async movements(req: Request, res: Response) { return res.json(await reportsService.movements(movementsReportQuerySchema.parse(req.query))); },
  async adjustments(req: Request, res: Response) { return res.json(await reportsService.adjustments(adjustmentsReportQuerySchema.parse(req.query))); },
  async consumption(req: Request, res: Response) { return res.json(await reportsService.consumption(consumptionReportQuerySchema.parse(req.query))); },
};
