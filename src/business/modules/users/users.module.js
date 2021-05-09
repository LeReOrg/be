import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import usersController from "./users.controller";

const router = Router();

router.get("/", wrap(usersController.get));

export default router;