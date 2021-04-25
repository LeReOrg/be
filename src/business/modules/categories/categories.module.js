import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import categoriesController from "./categories.controller";

const router = Router();

router.get("/", wrap(categoriesController.get));
router.post("/", wrap(categoriesController.create));
router.get("/:categoryId", wrap(categoriesController.getByIdOrThrowError));
router.patch("/:categoryId", wrap(categoriesController.update));
router.get("/:categoryId/products", wrap(categoriesController.getProductsByCategoryId));

export default router;