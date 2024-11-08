import mongoose, { Mongoose, Schema } from "mongoose";

const categorySchema = new Schema({
    name : {
        type : String,
        required : [true,`Category name is required`],
        maxlength: 32,
        unique: true,
        trim :true
    },
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
      }],
},{timestamps:true})


export const Category = mongoose.model("Category",categorySchema)