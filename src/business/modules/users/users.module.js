import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import usersController from "./users.controller";
import authenticationMiddle from "../authentication/authentication.middleware";

const router = Router();

router.get("/", wrap(usersController.get));
router.patch("/profile", authenticationMiddle, wrap(usersController.updateProfile));

export default router;