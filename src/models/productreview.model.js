import mongoose, { Schema } from "mongoose";
import { Product } from "./products.models";
import { EcomProfile } from "./profile.models";
import { ReviewStarEnum } from "../../utils/constant";

const productReview = new Schema({
    reviewFor : {
        type : Schema.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    reviewBy : {
        type : Schema.Types.ObjectId,
        ref : "EcomProfile",
        required : true,
    },
    star : {
        type : Number,
        enum : Object.values(ReviewStarEnum),
        default : ReviewStarEnum.NOT_RATED
    },
    review : {
        type : String,
        required : true,

    }
},{timestamps:true})


export const Review = mongoose.model("Review",productReview)