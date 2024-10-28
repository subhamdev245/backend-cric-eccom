import { Router } from "express";
import verifyJwt from "../middleware.js/auth.middleware.js";
import { isAdmin } from "../middleware.js/isAdmin.middleware.js";
import { createProduct, deleteProductDetails, editProductDetails, getProductByCategory}  from "../controller/product.controller.js";
import { upload } from "../middleware.js/multer.middleware.js";
import {createProductValidation,editProductValidation} from "../validator/product.validator.js";
import { validate } from "../validator/index.js";


const router = Router()

router.route("/upload-product").post(
    editProductValidation(),validate,verifyJwt , isAdmin ,upload.fields(
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
router.route("/update-product/:productId").put(
    createProductValidation(),validate,verifyJwt , isAdmin ,upload.fields(
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
    ),editProductDetails
)
router.route("/delete-product/:ProductId").delete(
    verifyJwt,isAdmin,deleteProductDetails
)
router.route("/get-product-cateory").get(
    verifyJwt,getProductByCategory
)
export  default router