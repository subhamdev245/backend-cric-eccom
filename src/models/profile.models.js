import mongoose, { Schema } from "mongoose";
import { UserRolesEnum } from "../../utils/constant";

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
        type: Number,
        enum: Object.values(UserRolesEnum), 
        default: UserRolesEnum.USER,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

export const EcomProfile = mongoose.model("EcomProfile", profileSchema); 
