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

// Subjects
router.route("/subjects").get(adminController.getAllSubjects);
router.route("/subject/:id").get(adminController.getSingleSubject);
router.route("/subject").post(adminController.saveSubject);
router.route("/subject/:id").delete(adminController.deleteSubject);

// Subject Types
router.route("/subject-types").get(adminController.getAllSubjectTypes);

// Units
router.route("/units").get(adminController.getAllUnits);
router.route("/unit/:id").get(adminController.getSingleUnit);
router.route("/unit").post(adminController.saveUnit);
router.route("/unit/:id").delete(adminController.deleteUnit);

// Unit Material
router.route("/unit-material").get(adminController.getAllUnitMaterial);
router.route("/unit-material/:id").get(adminController.getSingleUnitMaterial);
router.route("/unit-material").post(adminController.saveUnitMaterial);
router.route("/unit-material/:id").delete(adminController.deleteUnitMaterial);

// Batch
router.route("/batch").get(adminController.getAllBatches);
router.route("/batch/:id").get(adminController.getSingleBatch);
router.route("/batch").post(adminController.saveBatch);
router.route("/batch/:id").delete(adminController.deleteBatch);

export default router;
