
import { deleteFromCloudinaryByUrl, uploadOnCloudinary } from '../utils/cloudinary.js'; 
import sendResponse from '../utils/sendResponse.js'; 
import asyncHandler from '../utils/asyncHandler.js';
import { Product } from '../models/products.models.js';
import { Category } from '../models/category.models.js';

const createProduct = asyncHandler(async (req, res) => {
    const { category, description, name, price, stock } = req.body;

    
    const isExistCategory = await Category.findById(category);
    if (!isExistCategory) {
        return sendResponse(res, "Enter a valid Category", 401);
    }


    const mainImageLocalPath = req.files?.mainImage?.[0]?.path;
    const subImagesLocalPaths = req.files?.subImages.map(file => file.path);

    
    if (!mainImageLocalPath || subImagesLocalPaths.length === 0) {
        return sendResponse(res, "Main image and at least one sub-image are required", 400);
    }

    
    const mainImageUrl = await uploadOnCloudinary(mainImageLocalPath);
    
    
    const subImagesUrls = await Promise.all(
        subImagesLocalPaths.map(async (imagePath) => await uploadOnCloudinary(imagePath))
    );

    
    if (subImagesUrls.includes(null) || !mainImageUrl) {
        return sendResponse(res, "Error uploading images", 500);
    }

    
    const newProduct = await Product.create({
        category: isExistCategory._id,
        description,
        name,
        price,
        stock,
        mainImage: mainImageUrl,
        subImages: subImagesUrls,
    });

    
    if (!newProduct) {
        return sendResponse(res, "Error while creating Product", 501);
    }

    
    return sendResponse(res, "Product Created", 201, newProduct);
});

const editProductDetails = asyncHandler(async (req, res) => {
    const validAttributes = ['name', 'price', 'description', 'category', 'mainImage', 'subImages','stock'];
    const productId = req.params.productId;
    
    
    // Check if the product exists
    const validProduct = await Product.findById(productId);
    if (!validProduct) {
        return sendResponse(res, "Give a valid Product", 401);
    }

    const attributes = req.body;
    
    
    // Validate incoming attributes
    for (const key of Object.keys(attributes)) {
        if (!validAttributes.includes(key)) {
            return sendResponse(res, "Give a valid Attribute", 401);
        }
    }

    if (req.files?.mainImage) {
        
        console.log("mainImage");
        
        const mainImageLocalPath = req.files?.mainImage?.[0]?.path;
        if (!mainImageLocalPath) {
            return sendResponse(res, "Send a valid image", 401);
        }
        const mainImageUrl = await uploadOnCloudinary(mainImageLocalPath);
        if (!mainImageUrl) {
            return sendResponse(res, "Error uploading images", 500);
        }
       const responsedelete =  await deleteFromCloudinaryByUrl(validProduct.mainImage);
       if (!responsedelete) {
        return sendResponse(res, "Error uploading images", 500);
       } 
       await Product.findByIdAndUpdate(productId, { $unset: { mainImage: "" } }, { new: true });
        attributes.mainImage = mainImageUrl; 
    }

    
    if (req.files?.subImages) {
        const subImagesLocalPaths = req.files?.subImages.map(file => file.path) || [];

        if (subImagesLocalPaths.length === 0) {
            return sendResponse(res, "Send valid images", 401);
        }

        const subImagesUrls = await Promise.all(
            subImagesLocalPaths.map(async (imagePath) => await uploadOnCloudinary(imagePath))
        );

        if (subImagesUrls.includes(null)) {
            return sendResponse(res, "Error uploading images", 500);
        }

        await Promise.all(
            validProduct.subImages.map(async (imagePath) => await deleteFromCloudinaryByUrl(imagePath))
        );

        await Product.findByIdAndUpdate(productId, {
            $unset: { subImages: "" }
        }, { new: true });

        attributes.subImages = subImagesUrls; 
    }

    // Update product with valid attributes
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        attributes,
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        return sendResponse(res, "Error while updating Product", 501);
    }

    return sendResponse(res, "Product updated successfully", 200, updatedProduct);
});

export  {
    createProduct, 
    editProductDetails
};


































