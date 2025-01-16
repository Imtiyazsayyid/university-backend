import express from "express";
const router = express.Router();

import * as controller from "./webhookController";

router.route("/daily-time-table").post(controller.createDailyTimeTable);

export default router;
