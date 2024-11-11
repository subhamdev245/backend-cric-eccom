import { Router } from "express";
import { createCategory, getAllCategories, removeCategory } from "../controller/category.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = Router()

router.route("/add").post(verifyJwt,isAdmin,createCategory)
router.route("/remove/:categoryId").post(verifyJwt,isAdmin,removeCategory)
router.route("/get-category").get(getAllCategories)

export default router