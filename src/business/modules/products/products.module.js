import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import { ProductsController as Controller } from "./products.controller";

const router = Router();
const controller = new Controller();
router.get("/:productId", wrap(controller.getByIdOrThrowError));
router.get("/", wrap(controller.get));
router.post("/", wrap(controller.create));

export default router;