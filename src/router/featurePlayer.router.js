import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { createProduct, deleteProductDetails, editProductDetails, getProductByCategory, getSingleProduct}  from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/:playerId").get(getFeaturedPlayer)

