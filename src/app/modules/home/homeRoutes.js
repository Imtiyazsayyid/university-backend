import writeMiddleware from "../../middlewares/writeMiddleware";
import express from "express";
const router = express.Router();
import * as homeController from "./homeController";

router.route("/").get(homeController.getHome);
router.route("/").post(writeMiddleware, homeController.postHome);

export default router;
