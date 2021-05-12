import { Router } from "express";
import authenticationController from "./authentication.controller";
import wrap from "../../../share/helpers/wrapper";
import authenticationMiddleware from "./authentication.middleware";
import authenticationOtpMiddleware from "./authentication-otp.middle";

const router = Router();

router.post("/firebase-login", wrap(authenticationController.firebaseLogin));
router.post("/register", wrap(authenticationController.register));
router.post("/login", wrap(authenticationController.login));
router.get("/me", authenticationMiddleware, wrap(authenticationController.getLoggedInUserProfile));
router.patch("/password", authenticationMiddleware, wrap(authenticationController.selfChangePassword));
router.post("/password/email", wrap(authenticationController.sendForgotPasswordEmail));
router.post("/password/otp-code", authenticationOtpMiddleware, wrap(authenticationController.verifyOtpCode));
router.post("/password/reset", authenticationOtpMiddleware, wrap(authenticationController.resetPassword))

export default router;