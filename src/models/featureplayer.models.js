import mongoose, { Schema } from "mongoose";
import { Product } from "./products.models";


const featuredPlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  featuredProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
  }],
  featuredImage: {
    type: String,
    required: true, 
    trim: true, 
    default: "", 
  }
}, { timestamps: true });

export const FeaturedPlayer = mongoose.model("FeaturedPlayer", featuredPlayerSchema);
