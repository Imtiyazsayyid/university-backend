import express from "express";
import adminRoutes from "./modules/admin/adminRoutes";
import studentRoutes from "./modules/student/studentRoutes";

const router = express.Router();

router.use("/api/admin", adminRoutes);
router.use("/api/student", studentRoutes);

export default router;
