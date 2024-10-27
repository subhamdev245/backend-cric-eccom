import { EcomProfile } from "../models/profile.models.js";
import sendResponse from "./sendResponse.js";

const generateAccessAndRefreshToken = async(id) => {
   try {
     //checkid=> user !user throw err
     const user = await EcomProfile.findById(id)
     if(!user){
         return sendResponse(res,"User Not Found While Generating Token",404)
     }
     //if user then generate refresh and access token 
         const refreshToken = user.generateRefreshToken();  
         const accessToken = user.generateAccessToken();
         user.refreshToken = refreshToken;
         await user.save({ validateBeforeSave: false });
     //add refersh token to db and return access and  refersh token
     return {
         statusCode: 200,
         refreshToken,
         accessToken
     };
   } catch (error) {
    console.error(error);
    return sendResponse(res ,"Error While Generating Token" ,500)
   }
}

export default generateAccessAndRefreshToken;