import asyncHandler from "../utils/asyncHandler.js"
export const isAdmin = asyncHandler((req,res,next)=>{
    //get user
    const user = req.user
    //if isadmin true => next()
    if(user?.role === "ADMIN"){
        return next()
    }
    res.status(401).json({
        message : "UnAuthorisedAccess"
    })
    //else return NOTAUTHORISED
})

