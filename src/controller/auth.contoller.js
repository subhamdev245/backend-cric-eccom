import generateAccessAndRefreshToken from "../../utils/accessAndRefreshToken";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { EcomProfile } from "../models/profile.models";


const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body 
    //check for existed user 
   const isExisted = await  EcomProfile.find({
        $or : [{email},{name}]
    })
    if(isExisted){
        return sendResponse(res,"User Already Exist",402)
    }
    const newUser = await EcomProfile.create({
        name,email,password
    })
    const isCreatedUser = await EcomProfile.findById(newUser._id).select(" -password  -_id ")
    if (!isCreatedUser) {
        return sendResponse(res,"Server Internal Error",501)
    }
    return sendResponse(res,"User Created",201)
})

const logInUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body
    //find user by email check password 
    const existedUser = EcomProfile.findOne(email)
    if(!existedUser){
        return sendResponse(res,"Sign In Before Login",401)
    }
    const isPasswordCorrect = await existedUser.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        return sendResponse(res,"Check Your Credntials ",401)
    }
    // if user then generate access and refersh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser._id)
    //set cookie
    const options = {
        httpOnly: true,
    };
    return res.status(200) 
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User Logged in Successfully",
            user: existedUser
        });
})