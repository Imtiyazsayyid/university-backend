import express from "express";
const router = express.Router();

import * as adminController from "./adminController";
import authRoutes from "../authentication/authenticationRoutes";
import adminMiddleware from "../../middlewares/adminMiddleware";

router.use("/auth", authRoutes);
router.use(adminMiddleware);

// Admin Detials
router.route("/details").get(adminController.getAdminDetails);

// Courses
router.route("/courses").get(adminController.getAllCourses);
router.route("/course/:id").get(adminController.getSingleCourse);
router.route("/course").post(adminController.saveCourse);
router.route("/course/:id").delete(adminController.deleteCourse);

// Semesters
router.route("/semesters").get(adminController.getAllSemesters);
router.route("/semester/:id").get(adminController.getSingleSemester);
router.route("/semester").post(adminController.saveSemester);
router.route("/semester/:id").delete(adminController.deleteSemester);

export default router;
