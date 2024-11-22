import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { addItemToCart, decreaseQuantity, getCartDetails,clearCart } from "../controller/cart.controller.js";

const router = Router()

router.route("/get-cart").get(verifyJwt ,getCartDetails )
router.route("/add/:productId").post(verifyJwt,addItemToCart)
router.route("/clear-cart").post(verifyJwt,clearCart)
router.route("/decrease/:productId").post(verifyJwt,decreaseQuantity)

export default router