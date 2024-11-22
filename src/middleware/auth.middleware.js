import axios from "axios"
import sendResponse from "../utils/sendResponse.js"
import { EcomProfile } from "../models/profile.models.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async(req,res,next) => {
    console.log("hello");
    
    // STEPS:   
    // 1 Extract accessToken and  from req.cookies 
            // ! accessToken return
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    console.log(accessToken);
    
    if(!accessToken){
       return  sendResponse(res,"Unauthorized Access",401)
    }
    // 2 decode accesToken get user by decode option
            //! user retrun
    // 3 give user to req and next        
    try {
        const decodeInfo = jwt.verify( accessToken , process.env.ACCESS_TOKEN_SECRET)
        const user = await EcomProfile.findById(decodeInfo._id).select(" -password -refershToken")
        if (!user) {
           return sendResponse(res,"Invalid Access TOken",401)
        }
        req.user = user
        
        
        next()        
    } catch (error) {
        if (error === "TokenExpiredError") {
            try {
                const refershToken =  req.cookies?.refershToken
                if (!refershToken) {
                   return  sendResponse(res,"Invalid refreshToken",401)
                }
                const decodeInfo = jwt.verify(refershToken,process.env.REFRESH_TOKEN_SECRET)
                const getUser = EcomProfile.findById(decodeInfo._id)
                if(!getUser){
                    return sendResponse(res,"Session exipred Log In again",401)
                }
                const BASE_URL = `http://localhost:${process.env.PORT}/`;
                const response = await axios.post(`${process.env.BASE_URL}/refresh-token`, { refreshToken });
                if (!response) {
                    return sendResponse(res,"Error while refreshing Code")
                }
                return sendResponse(res,"Access TOken Refreshed",501)
                req.user = getUser
                next()

            } catch (refresherror) {
                return sendResponse(res,"Error ehile refreshing code",501)
            }
        }
    }
    




})

export default verifyJwt;
