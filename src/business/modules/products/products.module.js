import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import productsController from "./products.controller";
import authenticationMiddleware from "./../authentication/authentication.middleware";

const router = Router();

router.get("/:productId", wrap(productsController.getByIdOrThrowError));
router.get("/", wrap(productsController.get));
router.post("/", authenticationMiddleware, wrap(productsController.create));

export default router;