
import { Router } from "express";
import { logInUser , registerUser} from "../controller/auth.contoller.js";
import { loginUserValidator , registerUserValidator } from "../validator/auth.validator.js";
import { validate } from "../validator/index.js";


const router = Router()

router.route("/register").post(registerUserValidator(),validate,registerUser)
router.route("/login").post(loginUserValidator(),validate,logInUser)
export  default router