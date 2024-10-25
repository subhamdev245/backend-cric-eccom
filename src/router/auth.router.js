
import { Router } from "express";
import { logInUser , logout, registerUser} from "../controller/auth.contoller.js";
import { loginUserValidator , registerUserValidator } from "../validator/auth.validator.js";
import { validate } from "../validator/index.js";
import verifyJwt from "../middleware.js/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUserValidator(),validate,registerUser)
router.route("/login").post(loginUserValidator(),validate,logInUser)
router.route("/logout").post(verifyJwt,logout)
export  default router