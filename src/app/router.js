import express from "express";
import adminRoutes from "./modules/admin/adminRoutes";
import studentRoutes from "./modules/student/studentRoutes";
import teacherRoutes from "./modules/teacher/teacherRoutes";

const router = express.Router();

router.use("/api/admin", adminRoutes);
router.use("/api/student", studentRoutes);
router.use("/api/teacher", teacherRoutes);

export default router;
