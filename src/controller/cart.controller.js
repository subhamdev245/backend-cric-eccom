import { Cart } from "../models/cart.models.js";
import { Product } from "../models/products.models.js";
import { EcomProfile } from "../models/profile.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";

const getCartDetails = asyncHandler(async (req,res) => {
    const user = req.user._id
    console.log(user);
    
    const cart = await Cart.findOne({ customer: user })
    .populate({
      path: "items.product", 
      select: "name price mainImage", 
    })
    .select("items totalQty totalAmnt priceAfterDiscount"); 
    
    if(!cart){
        return sendResponse(res,"Empty Cart",200,[])
    }
    return sendResponse(res,"cart fetched Successfully",200,cart)
})

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const customerId = req.user._id;
    const { quantity = 1 } = req.body;
    console.log(customerId);
    
    
    
    
    
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
      if (isNaN(quantity) || quantity < 1) {
          return sendResponse(res, "Invalid quantity. Quantity must be a number greater than or equal to 1.", 400);
      }
  
      if (isNaN(product.price) || product.price <= 0) {
          return sendResponse(res, "Invalid product price.", 400);
      }
  
      const totalAmnt = product.price * quantity;
  
      if (isNaN(totalAmnt) || totalAmnt <= 0) {
          return sendResponse(res, "Invalid total amount calculated.", 400);
      }
  
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
          totalAmnt: totalAmnt,
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

  
  const decreaseQuantity = asyncHandler(
    async (req, res) => {
      const { productId } = req.params; 
      const { quantity = 1 } = req.body; 
  
      const cart = await Cart.findOne({ customer: req.user._id });
  
      if (!cart) {
          return sendResponse(res, "Cart not found", 404);
      }
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  
      if (itemIndex === -1) {
          return sendResponse(res, "Product not found in cart", 404);
      }
  
      let currentQuantity = cart.items[itemIndex].quantity;
  
      if (currentQuantity - quantity < 1) {
          const removedItem = cart.items.splice(itemIndex, 1)[0];
          cart.totalQty -= removedItem.quantity;
          cart.totalAmnt -= removedItem.price * removedItem.quantity;
      } else {
          cart.items[itemIndex].quantity -= quantity;
          cart.totalQty -= quantity;
          cart.totalAmnt -= cart.items[itemIndex].price * quantity;
      }
  
      await cart.save();
  
      return sendResponse(res, "Quantity updated successfully", 200, cart);
    }
  );
  
  const clearCart = asyncHandler(
    async (req, res) => {
      const cart = await Cart.findOne({ customer: req.user._id });
  
      if (!cart) {
          return sendResponse(res, "Cart not found", 404);
      }
  
      cart.items = [];  // Clear the items array
      cart.totalQty = 0; // Reset total quantity
      cart.totalAmnt = 0; // Reset total amount
  
      await cart.save();
  
      return sendResponse(res, "Cart cleared successfully", 200, cart);
    }
  );
  

export {
  getCartDetails,
  addItemToCart,
  decreaseQuantity,
  clearCart
}