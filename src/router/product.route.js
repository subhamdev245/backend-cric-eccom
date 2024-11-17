import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { createProduct, deleteProductDetails, editProductDetails, getAllProducts, getProductByCategory, getSingleProduct}  from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { createProductValidationMiddleware, editProductValidationMiddleware, getProductsValidationMiddleware } from "../middleware/product.middleware.js";



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
    ),createProductValidationMiddleware,createProduct
)
router.route("/edit-product/:id").put(
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
    ), editProductValidationMiddleware,editProductDetails
)
router.route("/delete-product/:ProductId").delete(
    verifyJwt,isAdmin,deleteProductDetails
)
router.route("/get-products/:category").get(
    getProductByCategory
)
router.route("/get-product/:productId").get(
    getSingleProduct
)
router.route("get-all-Products").get(
    getProductsValidationMiddleware,getAllProducts
)
export  default router