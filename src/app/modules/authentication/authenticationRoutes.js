import express from "express";
const router = express.Router();

import * as authenticationController from "./authenticationController";

router.route("/login").post(authenticationController.login);
router.route("/register").post(authenticationController.register);
router.route("/access-token").post(authenticationController.getAccessToken);

export default router;
