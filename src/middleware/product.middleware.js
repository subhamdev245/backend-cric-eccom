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

const editProductValidationMiddleware = (req, res, next) => {
    let { name, description, price, stock, categoryIds } = req.body;
    const mainImage = req.files?.mainImage || [];
    const subImages = req.files?.subImages || [];
  
    if (name && (typeof name !== 'string' || name.trim() === '')) {
      return sendResponse(res, 'Name must be a valid string if provided.', 400);
    }
  
    if (description && (typeof description !== 'string' || description.trim() === '')) {
      return sendResponse(res, 'Description must be a valid string if provided.', 400);
    }
  
    if (price && isNaN(price)) {
      return sendResponse(res, 'Price must be a valid number if provided.', 400);
    }
  
    if (stock && isNaN(stock)) {
      return sendResponse(res, 'Stock must be a valid number if provided.', 400);
    }
  
    if (categoryIds) {
      if (typeof categoryIds === 'string' && categoryIds.trim() !== '') {
        categoryIds = [categoryIds];
      } else if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return sendResponse(res, 'Category ID must be a valid non-empty string or a non-empty array if provided.', 400);
      }
    }
  
    if (mainImage.length > 1) {
      return sendResponse(res, 'You can upload only 1 main image for editing.', 400);
    }
  
    if (mainImage.length === 1 && !mainImage[0].mimetype.startsWith('image/')) {
      return sendResponse(res, 'Main image must be an image file if provided.', 400);
    }
  
    if (subImages.length > 5) {
      return sendResponse(res, 'You can upload up to 5 sub-images for editing.', 400);
    }
  
    subImages.forEach((file, index) => {
      if (!file.mimetype.startsWith('image/')) {
        return sendResponse(res, `Sub-image #${index + 1} must be an image file if provided.`, 400);
      }
    });
  
    next();
  };
const getProductsValidationMiddleware = (req, res, next) => {
    const { page = 1, limit = 10, sort = 'price', sortOrder = 'asc', category, priceRange } = req.body;
  
    if (page && (isNaN(page) || page <= 0)) {
      return sendResponse(res, 'Page must be a positive integer.', 400);
    }
  
    if (limit && (isNaN(limit) || limit <= 0)) {
      return sendResponse(res, 'Limit must be a positive integer.', 400);
    }
  
    if (sort && !['price', 'name', 'rating'].includes(sort)) {
      return sendResponse(res, 'Sort should be either "price", "name", or "rating".', 400);
    }
  
    if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
      return sendResponse(res, 'SortOrder should be either "asc" or "desc".', 400);
    }
  
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return sendResponse(res, 'Invalid category ID.', 400);
    }
  
    if (priceRange) {
      if (typeof priceRange !== 'object' || priceRange === null) {
        return sendResponse(res, 'Price range should be an object.', 400);
      }
  
      const { min, max } = priceRange;
  
      if ((min && isNaN(min)) || (max && isNaN(max))) {
        return sendResponse(res, 'Price range values must be numbers.', 400);
      }
  
      if (min !== undefined && max !== undefined && min > max) {
        return sendResponse(res, 'Min price cannot be greater than max price.', 400);
      }
    }
  
    next();
  };
  export {
    createProductValidationMiddleware,
    editProductValidationMiddleware,
    getProductsValidationMiddleware,
  }