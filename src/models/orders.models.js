import mongoose, { Schema } from "mongoose";
import { PaymentProviderEnum, OrderStatusEnum } from "../../utils/constant";


const orderSchema = new Schema({
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
    totalQuantity: {
        type: Number,
        min: [1, "Quantity can not be less then 1. "],
        default: 1,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true,
    },
    isPaymentDone: {
        type: Boolean,
        default: false,
    },
    paymentId: {
        type: String,
    },
    status: {
        type: String,
        enum: OrderStatusEnum,
        default: OrderStatusEnum.PENDING,
    },
    paymentProvider: {
        type: String,
        enum: PaymentProviderEnum,
        default: PaymentProviderEnum.UNKNOWN,
    },
    address: {
        addressLine1: {
            required: true,
            type: String,
        },
        addressLine2: {
            type: String,
        },
        city: {
            required: true,
            type: String,
        },
        country: {
            required: true,
            type: String,
        },
        pincode: {
            required: true,
            type: String,
        },
        state: {
            required: true,
            type: String,
        },
    },
}, { timestamps: true })


export const Order = mongoose.model("Order", orderSchema)