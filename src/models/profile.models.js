import mongoose, { Schema } from "mongoose";
import { UserRolesEnum } from "../utils/constant.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const profileSchema = new Schema({
    name: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Fixed typo here
        trim: true, 
    },
    password: {
        type: String,
        required: [true, "Password is required"], // Fixed typo in "require"
        minlength: [7, 'Must be at least 7 characters, got {VALUE}'] // Changed 'min' to 'minlength'
    },
    role: {
        type: String,
        enum: Object.values(UserRolesEnum), 
        default: UserRolesEnum.USER,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });


profileSchema.pre("save",async function (next) {
  if (this.isModified('password')) {
      try {
          const newPassword = await bcrypt.hash(this.password,10)
          this.password = newPassword
          
      } catch (error) {
        return   next(error)
      }
  }
  next()
})


profileSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

profileSchema.methods.generateRefreshToken =  function () {

  const refershtoken =  jwt.sign({
    _id : this._id,
    name: this.name,
  },process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  })
  return refershtoken
}
profileSchema.methods.generateAccessToken =  function () {

  const accesstoken =  jwt.sign({
    _id : this._id
  },process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  })
  return accesstoken
}

export const EcomProfile = mongoose.model("EcomProfile", profileSchema); 
