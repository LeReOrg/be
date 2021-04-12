import { Router } from "express";
import wrap from "../../../share/helpers/wrapper";
import { CategoriesController as Controller } from "./categories.controller";

const router = Router();
const controller = new Controller();

router.get("/", wrap(controller.get));
router.post("/", wrap(controller.create));
router.patch("/:categoryId", wrap(controller.update));
router.get("/:categoryId/products", wrap(controller.getProductsByCategoryId));

export default router;