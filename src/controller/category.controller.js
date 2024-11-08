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

const removeCategory = asyncHandler(async (req,res) => {

    const{category} = req.body
    const formattedCategory = category.trim().toUpperCase();


    if(formattedCategory === ""){
        return sendResponse(res," send valid category",401)
    }

    const isExistCategory = await Category.findOne({
        name : formattedCategory
    })
    
    
    if(!isExistCategory){
        return sendResponse(res,"Before deleting create category",401)
    }
    const response = await Category.findOneAndDelete({
        name : formattedCategory
    })
    if (response) {
        return sendResponse(res,"Category Removed",201)
    }
    return sendResponse(res,"Error While Deleting",501)
    
})
const getAllCategories = asyncHandler(async (req, res) => {
    try {
      
      const categories = await Category.find();
  
      if (!categories || categories.length === 0) {
        return sendResponse(res, "No categories found", 404);
      }
  
      
      return sendResponse(res, "Categories fetched successfully", 200, categories);
    } catch (error) {
      console.error(error);
      return sendResponse(res, "Error while fetching categories", 500);
    }
  });
  

export {
    removeCategory,
    createCategory,
    getAllCategories
}