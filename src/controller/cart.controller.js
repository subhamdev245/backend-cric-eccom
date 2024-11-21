import { Cart } from "../models/cart.models";
import { Product } from "../models/products.models";
import { EcomProfile } from "../models/profile.models";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";

const getCartDetails = asyncHandler(async (req,res) => {
    const user = req.user
    const cart = await Cart.findOne({ customer: user })
    .populate({
      path: "items.product", 
      select: "name price mainImage", 
    })
    .select("items totalQty totalAmnt priceAfterDiscount"); 
    
    if(!cart){
        return sendResponse(res,"Server Error",501)
    }
    return sendResponse(res,"cart fetched Successfully",200,cart)
})

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const customerId = req.user;
    const { quantity } = req.body || 1;
  
    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, "Product not found", 404);
    }
  
    if (quantity > product.stock) {
      return sendResponse(
        res,
        `Requested quantity exceeds available stock. Available stock: ${product.stock}`,
        400
      );
    }
  
    let cart = await Cart.findOne({ customer: customerId });
  
    if (!cart) {
      cart = new Cart({
        customer: customerId,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
        totalQty: quantity,
        totalAmnt: product.price * quantity,
      });
      await cart.save();
      return sendResponse(res, "Product added to cart", 201, cart);
    }
  
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
  
    if (existingItemIndex !== -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return sendResponse(
          res,
          `Adding this quantity exceeds available stock. Available stock: ${product.stock}`,
          400
        );
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      if (quantity > product.stock) {
        return sendResponse(
          res,
          `Requested quantity exceeds available stock. Available stock: ${product.stock}`,
          400
        );
      }
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
  
    cart.totalQty += quantity;
    cart.totalAmnt += product.price * quantity;
  
    await cart.save();
  
    return sendResponse(res, "Product added/updated in cart", 200, cart);
  });
  
  
const deleteItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const customerId = req.user;
  
    if (!productId) {
      return sendResponse(res, "Invalid request data", 400);
    }
  
    const cart = await Cart.findOne({ customer: customerId });
  
    if (!cart) {
      return sendResponse(res, "Cart not found", 404);
    }
  
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
  
    if (itemIndex === -1) {
      return sendResponse(res, "Product not found in cart", 404);
    }
  
    const removedItem = cart.items[itemIndex];
    cart.totalQty -= removedItem.quantity;
    cart.totalAmnt -= removedItem.price * removedItem.quantity;
  
    cart.items.splice(itemIndex, 1);
  
    if (cart.items.length === 0) {
      await Cart.deleteOne({ customer: customerId });
      return sendResponse(res, "Item removed, cart is now empty", 200);
    }
  
    await cart.save();
  
    return sendResponse(res, "Item removed from cart", 200, cart);
  });
  
    