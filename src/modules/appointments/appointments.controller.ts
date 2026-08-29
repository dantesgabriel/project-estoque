import { Request, Response } from "express";
import { appointmentListQuerySchema, cancelAppointmentSchema, createAppointmentSchema } from "./appointments.schema";
import { appointmentsService } from "./appointments.service";

export const appointmentsController = {
  async listResponsibleUsers(_req: Request, res: Response) { return res.json(await appointmentsService.listResponsibleUsers()); },
  async list(req: Request, res: Response) { return res.json(await appointmentsService.list(appointmentListQuerySchema.parse(req.query))); },
  async getById(req: Request, res: Response) { return res.json(await appointmentsService.getById(req.params.id)); },
  async tutorHistory(req: Request, res: Response) { return res.json(await appointmentsService.tutorHistory(req.params.id)); },
  async create(req: Request, res: Response) { return res.status(201).json(await appointmentsService.create(createAppointmentSchema.parse(req.body), req.user!.id)); },
  async cancel(req: Request, res: Response) { return res.json(await appointmentsService.cancel(req.params.id, cancelAppointmentSchema.parse(req.body).reason, req.user!.id)); },
};
