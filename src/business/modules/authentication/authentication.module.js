import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import { AuthenticationController as Controller } from "./authentication.controller";

const router = Router();
const controller = new Controller();

router.post("/firebase-login", wrap(controller.firebaseLogin));
router.post("/register", wrap(controller.register));
router.post("/login", wrap(controller.login));

export default router;