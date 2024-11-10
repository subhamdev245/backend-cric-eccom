import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { createProduct, deleteProductDetails, editProductDetails, getProductByCategory}  from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
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
router.route("/edit-product/:productId").put(
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
router.route("/get-products/:category").get(
    verifyJwt,getProductByCategory
)
export  default router