import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import { ProductsController as Controller } from "./products.controller";

const router = Router();
const controller = new Controller();
router.get("/:productId", wrap(controller.getById));
router.post("/", wrap(controller.create));

export default router;