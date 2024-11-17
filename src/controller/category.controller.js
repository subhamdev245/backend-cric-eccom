import mongoose from "mongoose";
import { Category } from "../models/category.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";

const createCategory = asyncHandler(async (req,res) => {

    const{category} = req.body
    const formattedCategory = category.trim().toUpperCase();

    
    if(formattedCategory === ""){
        return sendResponse(res,"send valid category",401)
    }
    const isExistCategory = await Category.findOne({
        name : formattedCategory
    })
    
    
    if(isExistCategory){
        return sendResponse(res,"Already Exist",401)
    }
    const newCategory = await Category.create({
        name : formattedCategory
    })
    if (!newCategory) {
        return sendResponse(res,"Error While creating",501) 
    }
    return sendResponse(res,"Category Created",201)
})

const removeCategory = asyncHandler(async (req, res) => {
    const {categoryId}  = req?.params;
    
    
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        return sendResponse(res, "Please provide a valid category ID", 400);
    }

    const isExistCategory = await Category.findById(categoryId);

    if (!isExistCategory) {
        return sendResponse(res, "Category not found", 404);
    }

    const response = await Category.findByIdAndDelete(categoryId);

    if (response) {
        return sendResponse(res, "Category removed successfully", 200);
    }

    return sendResponse(res, "Error while deleting category", 500);
});

const getAllCategories = asyncHandler(async (req, res) => {
    
    
      const categories = await Category.find();
  
      if (!categories || categories.length === 0) {
        return sendResponse(res, "No categories found", 404);
      }
  
      return sendResponse(res, "Categories fetched successfully", 200, categories);
    
  });
  

export {
    removeCategory,
    createCategory,
    getAllCategories
}