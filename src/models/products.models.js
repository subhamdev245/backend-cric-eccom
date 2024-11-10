import mongoose, { Schema } from "mongoose";


const productSchema = new Schema ({
    category: [
      {
        type : Schema.Types.ObjectId,
        ref : "Category",
        required : true
      }
    ],
      description: {
        required: true,
        type: String,
      },
      mainImage: [
        {
          required: true,
          type : String //cloudinary url
        },
      ],
      name: {
        unique : true,
        required: true,
        type: String,
      },
      price: {
        default: 0,
        type: Number,
      },
      stock: {
        default: 1,
        type: Number,
      },
      subImages: {
        type : [String], //cloudinary url
        default: [],
      },
      featuredPlayers : [
        {
          type : Schema.Types.ObjectId,
          ref : "FeaturedPlayer",
          required : false
        }
      ]
},{timestamps:true})


export const Product = mongoose.model("Product",productSchema)