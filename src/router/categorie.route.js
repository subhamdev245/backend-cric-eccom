import { Router } from "express";
import { createCategory, removeCategory } from "../controller/category.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";

const router = Router()

router.route("/add").post(verifyJwt,isAdmin,createCategory)
router.route("/remove").post(verifyJwt,isAdmin,removeCategory)

export default router