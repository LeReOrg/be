import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import productsController from "./products.controller";

const router = Router();

router.get("/:productId", wrap(productsController.getByIdOrThrowError));
router.get("/", wrap(productsController.get));
router.post("/", wrap(productsController.create));

export default router;