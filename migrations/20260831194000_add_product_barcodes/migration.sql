-- Vários fabricantes podem comercializar o mesmo produto com códigos distintos.
CREATE TABLE "product_barcodes" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "barcode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "product_barcodes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_barcodes_barcode_key" ON "product_barcodes"("barcode");
CREATE INDEX "product_barcodes_productId_idx" ON "product_barcodes"("productId");

ALTER TABLE "product_barcodes"
  ADD CONSTRAINT "product_barcodes_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Conserva os códigos já existentes como a primeira associação de cada produto.
INSERT INTO "product_barcodes" ("id", "productId", "barcode")
SELECT CONCAT('legacy-', "id"), "id", "barcode"
FROM "products"
WHERE "barcode" IS NOT NULL;
