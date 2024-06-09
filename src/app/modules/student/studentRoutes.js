import express from "express";
const router = express.Router();

import * as studentController from "./studentController";
import authRoutes from "../authentication/authenticationRoutes";
import studentMiddleware from "../../middlewares/studentMiddleware";

router.use("/auth", authRoutes);
router.use(studentMiddleware);

// Student Details
router.route("/details").get(studentController.getStudentDetails);

export default router;
