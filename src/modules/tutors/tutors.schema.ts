import { z } from "zod";

const documentTypeSchema = z.enum(["CPF", "CNPJ"]);
const requiredText = (label: string) => z.string().trim().min(1, `${label} é obrigatório`);

export const createTutorSchema = z.object({
  name: requiredText("Nome"),
  documentType: documentTypeSchema,
  document: requiredText("Documento"),
  rg: z.string().trim().optional(),
  phone: requiredText("Telefone"),
  email: z.string().trim().email("E-mail inválido"),
  street: requiredText("Rua"),
  number: requiredText("Número"),
  complement: z.string().trim().optional(),
  neighborhood: requiredText("Bairro"),
  city: requiredText("Cidade"),
  state: z.string().trim().length(2, "Informe a UF com 2 letras").transform((value) => value.toUpperCase()),
  zipCode: requiredText("CEP"),
});

export const updateTutorSchema = createTutorSchema.partial().extend({
  active: z.boolean().optional(),
});

export const createPetSchema = z.object({
  name: requiredText("Nome"),
  species: z.enum(["CAO", "GATO", "AVE", "ROEDOR", "REPTIL", "OUTRO"]),
  breed: z.string().trim().optional(),
  birthDate: z.coerce.date().optional(),
  approximateAge: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const updatePetSchema = createPetSchema.partial().extend({
  active: z.boolean().optional(),
});

export const tutorListQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export type CreateTutorInput = z.infer<typeof createTutorSchema>;
export type UpdateTutorInput = z.infer<typeof updateTutorSchema>;
export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
