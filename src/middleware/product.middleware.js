import sendResponse from "../utils/sendResponse.js";



const createProductValidationMiddleware = (req, res, next) => {
    const { name, description, price, stock } = req.body;
    const mainImage = req.files?.mainImage || [];
    const subImages = req.files?.subImages || [];
    let {categoryIds} = req.body 
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return sendResponse(res, 'Name is required and must be a string.', 400);
    }
  
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return sendResponse(res, 'Description is required and must be a string.', 400);
    }
  
    if (!price || isNaN(price)) {
      return sendResponse(res, 'Price is required and must be a valid number.', 400);
    }
  
    if (!stock || isNaN(stock)) {
      return sendResponse(res, 'Stock is required and must be a valid number.', 400);
    }
  
    if (categoryIds) {
        if (typeof categoryIds === 'string' && categoryIds.trim() !== '') {
          categoryIds = [categoryIds];
        } else if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
          return sendResponse(res, 'Category ID must be a valid non-empty string or a non-empty array.', 400);
        }
      } else {
        return sendResponse(res, 'Category ID is required.', 400);
      }
  
    if (mainImage.length !== 1) {
      return sendResponse(res, 'You must upload exactly 1 main image.', 400);
    }
  
    if (!mainImage[0].mimetype.startsWith('image/')) {
      return sendResponse(res, 'Main image must be an image file.', 400);
    }
  
    if (subImages.length < 1 || subImages.length > 5) {
      return sendResponse(res, 'You must upload between 1 and 5 sub-images.', 400);
    }
  
    subImages.forEach((file, index) => {
      if (!file.mimetype.startsWith('image/')) {
        return sendResponse(res, `Sub-image #${index + 1} must be an image file.`, 400);
      }
    });
  
    next();
  };

  export {
    createProductValidationMiddleware
  }