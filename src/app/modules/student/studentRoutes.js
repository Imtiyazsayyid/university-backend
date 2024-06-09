import express from "express";
const router = express.Router();

import * as studentController from "./studentController";
import authRoutes from "../authentication/authenticationRoutes";
import studentMiddleware from "../../middlewares/studentMiddleware";

router.use("/auth", authRoutes);
router.use(studentMiddleware);

// Student Details
router.route("/details").get(studentController.getStudentDetails);

// Batch
router.route("/batch").get(studentController.getStudentBatch);

// Subject
router.route("/subject/:subjectId").get(studentController.getSingleSubject);

// Unit Materials
router.route("/unit/:unitId").get(studentController.getSingleUnit);

export default router;
