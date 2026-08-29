import { Request, Response } from "express";
import { createPetSchema, createTutorSchema, tutorListQuerySchema, updatePetSchema, updateTutorSchema } from "./tutors.schema";
import { tutorsService } from "./tutors.service";

export const tutorsController = {
  async list(req: Request, res: Response) { return res.json(await tutorsService.list(tutorListQuerySchema.parse(req.query).search)); },
  async getById(req: Request, res: Response) { return res.json(await tutorsService.getById(req.params.id)); },
  async create(req: Request, res: Response) { return res.status(201).json(await tutorsService.create(createTutorSchema.parse(req.body))); },
  async update(req: Request, res: Response) { return res.json(await tutorsService.update(req.params.id, updateTutorSchema.parse(req.body))); },
  async createPet(req: Request, res: Response) { return res.status(201).json(await tutorsService.createPet(req.params.id, createPetSchema.parse(req.body))); },
  async getPet(req: Request, res: Response) { return res.json(await tutorsService.getPetById(req.params.id)); },
  async updatePet(req: Request, res: Response) { return res.json(await tutorsService.updatePet(req.params.id, updatePetSchema.parse(req.body))); },
};
