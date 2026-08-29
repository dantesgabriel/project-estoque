import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { categoriesRoutes } from "./modules/categories/categories.routes";
import { productsRoutes } from "./modules/products/products.routes";
import { stockMovementsRoutes } from "./modules/stock-movements/stock-movements.routes";
import { inventoryRoutes } from "./modules/inventory/inventory.routes";
import { adjustmentsRoutes } from "./modules/adjustments/adjustments.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { batchesRoutes } from "./modules/batches/batches.routes";
import { suppliersRoutes } from "./modules/suppliers/suppliers.routes";
import { tutorsRoutes, petsRoutes } from "./modules/tutors/tutors.routes";
import { appointmentsRoutes } from "./modules/appointments/appointments.routes";
import { appointmentsController } from "./modules/appointments/appointments.controller";
import { errorHandler } from "./shared/middlewares/errorHandler";
import { asyncHandler } from "./shared/middlewares/asyncHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productsRoutes);
app.use("/stock-movements", stockMovementsRoutes);
app.use("/inventories", inventoryRoutes);
app.use("/adjustments", adjustmentsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/batches", batchesRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/tutors", tutorsRoutes);
app.use("/pets", petsRoutes);
app.use("/appointments", appointmentsRoutes);
app.get("/tutors/:id/history", asyncHandler(appointmentsController.tutorHistory));

// Precisa ser o último app.use — captura erros de todas as rotas acima.
app.use(errorHandler);
