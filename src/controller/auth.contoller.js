import generateAccessAndRefreshToken from "../../utils/accessAndRefreshToken.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import { EcomProfile } from "../models/profile.models.js";


const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body 
    //check for existed user 
   const isExisted = await  EcomProfile.findOne({
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
    const existedUser = await EcomProfile.findOne({email})
    if(!existedUser){
        return sendResponse(res,"Sign In Before Login",401)
    }
    const isMatch = await existedUser.isPasswordCorrect(password)
    if (!isMatch) {
        return sendResponse(res,"Check Your Credntials ",401)
    }
    // if user then generate access and refersh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser._id)
    //set cookie
    const loggedInUser = await EcomProfile.findById(existedUser._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure : true
    };
    return res.status(200) 
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User Logged in Successfully",
            user: loggedInUser
        });
})
const logout = asyncHandler(async(req,res)=>{
    //find user
    await EcomProfile.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken: ""
        }
    },{
        new:true
    }) 
    
    //clear cookies
    const options = {
        httpOnly:true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken",options)
    .json({
        message : "User Logged Out"
    })
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    //access refersh token
    const incomingRefershToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefershToken) {
        sendResponse(res,"Invalid Refersh Token",401)
    }
    //decode refersh token and finduser
    const decoded = jwt.verify(incomingRefershToken,process.env.REFRESH_TOKEN_SECRET)

    const user = EcomProfile.findById(decoded._id)
    if (!user) {
        sendResponse(res,"Unauthorized Access",401)
    }
    if(incomingRefershToken !== user?.refreshToken){
        sendResponse(res,"expired Or used",401)
    }
    //send cookie
    const option = {
        httpOnly : true,
        secure : true,
    }
    const{accessToken,refreshToken} = generateAccessAndRefreshToken(user._id)
    return res.status(200).cookie("accessToken",accessToken,option).cookie(
        "refreshToken",refreshToken,option
    ).sendResponse()
})
const changePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await EcomProfile.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        return  sendResponse(res,"InvalidPassword",401)
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false});

    return sendResponse(res,"Password updated Succesfully",201)
})
export {
    logInUser,
    registerUser,
    logout,
    changePassword,
    
}