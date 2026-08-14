import { prisma } from "../../config/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./categories.schema";

export const categoriesRepository = {
  list() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },

  create(data: CreateCategoryInput) {
    return prisma.category.create({ data });
  },

  update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data });
  },

  // Conta produtos vinculados — usado para impedir exclusão de categoria em uso.
  countProducts(id: string) {
    return prisma.product.count({ where: { categoryId: id } });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
