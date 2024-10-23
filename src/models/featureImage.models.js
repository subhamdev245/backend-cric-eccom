import mongoose, { Schema } from "mongoose";
import { Product } from "./products.models";
const featureImageSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    altText: {
        type: String,
        required: true,
    },
    relatedToPlayer: {
        type: Schema.Types.ObjectId,
        ref: "Player", 
    },
    relatedToProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product", 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const FeatureImage = mongoose.model("FeatureImage", featureImageSchema);
