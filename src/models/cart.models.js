import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        customer: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: "EcomProfile"
        },
        items: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    quantity: {
                        type: Number,
                        min: [1, "Quantity can not be less then 1. "],
                        default: 1,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true,
                    }
                }
            ],
            default: []
        },
        totalQty: {
            type: Number,
            default: 1,
            required: true
        },
        totalAmnt : {
            type: Number,
            
            required: true
        },
        priceAfterDiscount : {
            type : Number,
            required : false
        }
        

    },

    { timestamps: true }
);


export const Cart = mongoose.model("Cart",cartSchema)