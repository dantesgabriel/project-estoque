import { prisma } from "../../config/prisma";
import { CreateSupplierInput, UpdateSupplierInput } from "./suppliers.schema";

export const suppliersRepository = {
  list() {
    return prisma.supplier.findMany({ orderBy: { name: "asc" } });
  },
  findById(id: string) {
    return prisma.supplier.findUnique({ where: { id } });
  },
  findByName(name: string) {
    return prisma.supplier.findUnique({ where: { name } });
  },
  findByDocument(document: string) {
    return prisma.supplier.findUnique({ where: { document } });
  },
  create(data: CreateSupplierInput) {
    return prisma.supplier.create({ data });
  },
  update(id: string, data: UpdateSupplierInput) {
    return prisma.supplier.update({ where: { id }, data });
  },
  countMovements(id: string) {
    return prisma.stockMovement.count({ where: { supplierId: id } });
  },
  delete(id: string) {
    return prisma.supplier.delete({ where: { id } });
  },
};
