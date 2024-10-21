import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name : {
        type : String,
        required : [true,`Category name is required`],
        maxlength: 32,
        unique: true,
        trim :true
    }
},{timestamps:true})


export const Category = mongoose.model("Category",categorySchema)