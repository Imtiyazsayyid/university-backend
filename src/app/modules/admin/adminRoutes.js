import express from "express";
const router = express.Router();

import * as adminController from "./adminController";
import authRoutes from "../authentication/authenticationRoutes";
import adminMiddleware from "../../middlewares/adminMiddleware";

router.use("/auth", authRoutes);
router.use(adminMiddleware);

// Admin Detials
router.route("/details").get(adminController.getAdminDetails);

export default router;
