
import { deleteFromCloudinaryByUrl, uploadOnCloudinary } from '../utils/cloudinary.js';
import sendResponse from '../utils/sendResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Product } from '../models/products.models.js';
import { Category } from '../models/category.models.js';
import mongoose from 'mongoose';
import { FeaturedPlayer } from '../models/featureplayer.models.js';

const createProduct = asyncHandler(async (req, res) => {
    const { description, name, price, stock } = req.body;
    let { categoryIds, featuredPlayersIds } = req.body

    if (!categoryIds || (typeof categoryIds === 'string' && categoryIds.trim().length === 0) || (Array.isArray(categoryIds) && categoryIds.length === 0)) {
        return sendResponse(res, "Please provide valid category IDs", 400);
    }

    if (Array.isArray(categoryIds)) {
        const invalidCategoryIds = categoryIds.filter(categoryId =>
            !mongoose.Types.ObjectId.isValid(categoryId)
        );

        if (invalidCategoryIds.length > 0) {
            return sendResponse(res, `Invalid category ID(s): ${invalidCategoryIds.join(', ')}`, 400);
        }

        const categories = await Category.find({ '_id': { $in: categoryIds } });

        if (categories.length !== categoryIds.length) {
            return sendResponse(res, "One or more categories not found", 404);
        }

    }

    const isExistCategory = Category.findById(categoryIds)
    if (!isExistCategory) {
        return sendResponse(res, "categorie not found", 404);
    }
    categoryIds = [categoryIds]


    const isExistProduct = await Product.findOne({ name });
    if (isExistProduct) {
        return sendResponse(res, "Product already exists, enter a new product", 401);
    }


    let validFeaturedPlayersIds = [];
    if (featuredPlayersIds) {
        if (typeof featuredPlayersIds === 'string') {
            validFeaturedPlayersIds = [featuredPlayersIds];
        } else if (Array.isArray(featuredPlayersIds)) {
            validFeaturedPlayersIds = featuredPlayersIds;
        }

        const invalidFeaturedPlayersIds = validFeaturedPlayersIds.filter(
            (id) => !mongoose.Types.ObjectId.isValid(id)
        );

        if (invalidFeaturedPlayersIds.length > 0) {
            return sendResponse(res, `Invalid featured player IDs: ${invalidFeaturedPlayersIds.join(', ')}`, 400);
        }

        if (validFeaturedPlayersIds.length > 0) {
            const featuredPlayers = await Player.find({
                '_id': { $in: validFeaturedPlayersIds }
            });

            if (featuredPlayers.length !== validFeaturedPlayersIds.length) {
                return sendResponse(res, "One or more players not found", 404);
            }
        }
    }


    const mainImageLocalPath = req.files?.mainImage?.[0]?.path;
    const subImagesLocalPaths = req.files?.subImages?.map(file => file.path);

    if (!mainImageLocalPath || subImagesLocalPaths.length === 0) {
        return sendResponse(res, "Main image and at least one sub-image are required", 400);
    }


    const mainImageUrl = await uploadOnCloudinary(mainImageLocalPath);
    const subImagesUrls = await Promise.all(
        subImagesLocalPaths.map(imagePath => uploadOnCloudinary(imagePath))
    );


    if (subImagesUrls.includes(null) || !mainImageUrl) {
        return sendResponse(res, "Error uploading images", 500);
    }


    const newProduct = await Product.create({
        category: categoryIds,
        description,
        name,
        price,
        stock,
        mainImage: mainImageUrl,
        subImages: subImagesUrls,
        featuredPlayers: validFeaturedPlayersIds,
    });
    if (!newProduct) {
        return sendResponse(res, "Error while creating Product", 501);
    }


    const CategoryUpdated = await Promise.all(
        categoryIds.map(async (categoryId) => {

            await Category.findByIdAndUpdate(
                categoryId,
                { $push: { relatedProducts: newProduct._id } }, // $push to add the product ID
                { new: true } // Return the updated category
            );
        })
    );
    if (!CategoryUpdated) {
        sendResponse(res, "Error while pushing product in Category ")
    }

    if (featuredPlayersIds) {
        const featuredPlayersUpdated = await Promise.all(
            validFeaturedPlayersIds.map(async (playerId) => {
                await FeaturedPlayer.findByIdAndUpdate(
                    playerId,
                    { $push: { featuredProducts: newProduct._id } },
                    { new: true }
                );
            })
        );

        if (!featuredPlayersUpdated) {
            return sendResponse(res, "Error while pushing product in featured players", 400);
        }
    }




    return sendResponse(res, "Product Created Successfully", 201, newProduct);
});

const editProductDetails = asyncHandler(async (req, res) => {
    const validAttributes = ['name', 'price', 'description', 'category', 'mainImage', 'subImages', 'stock'];
    const productId = req.params?.id;
    console.log(productId);

    const attributes = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return sendResponse(res, "Product not found", 404);
    }

    const invalidAttributes = Object.keys(attributes).filter(key => !validAttributes.includes(key));
    if (invalidAttributes.length > 0) {
        return sendResponse(res, `Invalid attribute(s): ${invalidAttributes.join(', ')}`, 400);
    }

    if (req.files?.mainImage) {
        const mainImageLocalPath = req.files.mainImage[0]?.path;
        if (!mainImageLocalPath) {
            return sendResponse(res, "Main image is required", 400);
        }

        const mainImageUrl = await uploadOnCloudinary(mainImageLocalPath);
        if (!mainImageUrl) {
            return sendResponse(res, "Error uploading main image", 500);
        }

        const deleteOldImage = await deleteFromCloudinaryByUrl(product.mainImage);
        if (!deleteOldImage) {
            return sendResponse(res, "Error deleting old main image", 500);
        }

        attributes.mainImage = mainImageUrl;
    }

    if (req.files?.subImages) {
        const subImagesLocalPaths = req.files.subImages.map(file => file.path) || [];
        if (subImagesLocalPaths.length === 0) {
            return sendResponse(res, "At least one sub-image is required", 400);
        }

        const subImagesUrls = await Promise.all(
            subImagesLocalPaths.map(async (imagePath) => await uploadOnCloudinary(imagePath))
        );

        if (subImagesUrls.includes(null)) {
            return sendResponse(res, "Error uploading sub-images", 500);
        }

        await Promise.all(
            product.subImages.map(async (imagePath) => await deleteFromCloudinaryByUrl(imagePath))
        );

        attributes.subImages = subImagesUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        attributes,
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        return sendResponse(res, "Error while updating product", 500);
    }

    return sendResponse(res, "Product updated successfully", 200, updatedProduct);
});

const deleteProductDetails = asyncHandler(async (req, res) => {
    const ProductId = req.params?.ProductId
    if (!ProductId) {
        return sendResponse(res, "Enter valid Product", 401)
    }
    const isExistProduct = await Product.findByIdAndDelete(ProductId)
    if (!isExistProduct) {
        return sendResponse(res, "Enter valid Product", 401)
    }
    return sendResponse(res, "Product Deleted", 201)
})

const getProductByCategory = asyncHandler(async (req, res) => {
    const category = req.params?.category

    if (!category) {
        return sendResponse(res, "Category ID is required", 400);
    }

    const isExistCategory = await Category.findById(
        category
    )
    if (!isExistCategory) {
        return sendResponse(res, "Category does not exist", 401)
    }
    const products = await Product.find({ category: category })
        .populate('featuredPlayers');
    if (products.length === 0) {
        return sendResponse(res, 'No products found in this category', 404);
    }
    const ProductData = products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        mainImage: product.mainImage,
        subImages: product.subImages,
        // Handle featured players
        featuredPlayers: product.featuredPlayers.length > 0
            ? product.featuredPlayers.map(player => player.name)
            : [],
    }));
    return sendResponse(res, "Product Fetched succesully", 201, ProductData)
}
)

const getSingleProduct = asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const product = await Product.findById(productId)
        .populate('featuredPlayers');
    if (!product) {
        return sendResponse(res, 'Product not found', 404);
    }
    const response = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        mainImage: product.mainImage,
        subImages: product.subImages,
        featuredPlayers: product.featuredPlayers.length > 0 ?
            product.featuredPlayers.map(player => player.name) : [],
    };
    return sendResponse(res, 'Product fetched successfully', 200, response);
});

const getAllProducts = asyncHandler(async (req, res) => {

    const queryObj = { ...req.body }
    
    
    const excludeFields = ["page", "sort", "limit" , "sortOrder"]

    excludeFields.forEach(el => {
        delete queryObj[el]
    })
    const { page = 1, limit = 10, sort = 'price', sortOrder = 'asc' } = req.body;
    const skip = (page - 1) * limit;
    const sortObj = {};
    
    
    if (sort === 'price') {

        sortObj.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sort === 'name') {

        sortObj.name = sortOrder === 'asc' ? 1 : -1;
    } else {

        sortObj.price = sortOrder === 'asc' ? 1 : -1;
    }
    
    const Products = await Product.find(queryObj).skip(skip).limit(limit).sort(sortObj).populate("featuredPlayers category")
    const totalProducts = await Product.countDocuments(queryObj);
    if (!Products || Products.length === 0) {
        return sendResponse(res, "No Product Found ", 404)
    }
    const hasMore = totalProducts > page * limit;
    return sendResponse(res, "Products fetched successfully", 200, {
        Products,
        hasMore,
        totalProducts,
    });
})

export {
    createProduct,
    editProductDetails,
    deleteProductDetails,
    getProductByCategory,
    getSingleProduct,
    getAllProducts
};


































