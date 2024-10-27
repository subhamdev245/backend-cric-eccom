import { Router } from "express";
import verifyJwt from "../middleware.js/auth.middleware.js";
import { isAdmin } from "../middleware.js/isAdmin.middleware.js";
import createProduct from "../controller/product.controller.js";
import { upload } from "../middleware.js/multer.middleware.js";
import createProductValidation from "../validator/createProductValidator.js";
import { validate } from "../validator/index.js";


const router = Router()

router.route("/upload-product").post(
    verifyJwt , isAdmin ,upload.fields(
        [
            {
                name: "mainImage",
                maxCount: 1
            }, 
            {
                name: "subImages",
                maxCount: 4
            }
    

        ]
    ),createProduct
)

export  default router