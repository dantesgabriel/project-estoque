import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { CreateProductInput, ListProductsQuery, UpdateProductInput } from "./products.schema";

export const productsRepository = {
  findById(id: string) {
    return prisma.product.findUnique({ where: { id }, include: { category: true, barcodes: true } });
  },

  findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  },

  async findByBarcode(barcode: string) {
    const association = await prisma.productBarcode.findUnique({
      where: { barcode },
      include: { product: { include: { category: true } } },
    });

    if (association) return association.product;

    // Compatibilidade para a breve janela entre atualizar o código e aplicar a migration.
    return prisma.product.findUnique({ where: { barcode }, include: { category: true } });
  },

  createBarcode(productId: string, barcode: string) {
    return prisma.productBarcode.create({ data: { productId, barcode } });
  },

  // lowStock (currentStock <= minStock) compara duas colunas — Prisma não suporta isso
  // direto no "where", então usamos $queryRaw só para esse filtro específico.
  async list(filters: ListProductsQuery) {
    if (filters.lowStock) {
      return prisma.$queryRaw`
        SELECT p.*, row_to_json(c.*) as category
        FROM products p
        JOIN categories c ON c.id = p."categoryId"
        WHERE p."currentStock" <= p."minStock"
          ${filters.categoryId ? Prisma.sql`AND p."categoryId" = ${filters.categoryId}` : Prisma.empty}
          ${filters.active !== undefined ? Prisma.sql`AND p.active = ${filters.active}` : Prisma.empty}
          ${filters.name ? Prisma.sql`AND p.name ILIKE ${"%" + filters.name + "%"}` : Prisma.empty}
        ORDER BY p.name ASC
      `;
    }

    const where: Prisma.ProductWhereInput = {
      ...(filters.name && { name: { contains: filters.name, mode: "insensitive" } }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.active !== undefined && { active: filters.active }),
      ...(filters.zeroStock && { currentStock: 0 }),
    };

    return prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    });
  },

  create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        categoryId: data.categoryId,
        unit: data.unit,
        minStock: data.minStock,
        maxStock: data.maxStock,
        location: data.location,
        tracksBatch: data.tracksBatch,
      },
      include: { category: true },
    });
  },

  update(id: string, data: UpdateProductInput) {
    return prisma.product.update({ where: { id }, data, include: { category: true } });
  },
};
