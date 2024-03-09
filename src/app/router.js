import express from "express";
import adminRoutes from "./modules/admin/adminRoutes";

const router = express.Router();

router.use("/api/admin", adminRoutes);

export default router;
