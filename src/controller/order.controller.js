import { Order } from "../models/orders.models";
import { Product } from "../models/products.models";
import { EcomProfile } from "../models/profile.models";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";


const createOrder = asyncHandler(async(req,res)=>{
    const orderData = req.body 
    const productIds = orderData.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {

        return sendResponse(res,"One or more products do not exist",400)
    }
    const newOrder  = await Order.create(orderData)
    if (!newOrder) {
        return sendResponse(res,"Error while Creating Order",501)
    }
    return sendResponse(res,"Order Created",201)
})