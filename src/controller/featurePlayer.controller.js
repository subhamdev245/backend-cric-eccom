import { FeaturedPlayer } from "../models/featureplayer.models";
import { Product } from "../models/products.models";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";

const getFeaturedPlayer = asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await FeaturedPlayer.findById(playerId).populate('featuredProducts');
    if (!player) {
        return sendResponse(res, 'Featured player not found', 404);
    }
    return sendResponse(res, 'Featured player fetched successfully', 200, player);
});

const addFeaturedPlayer = asyncHandler(async (req, res) => {
    const { name, featuredProductsIds } = req.body;
    const featuredImageLocalPath = req.files?.featuredImage?.[0]?.path;

    if (!name || !featuredImageLocalPath) {
        return sendResponse(res, "All fields are mandatory", 400);
    }

    const existingPlayer = await FeaturedPlayer.findOne({ name });
    if (existingPlayer) {
        return sendResponse(res, 'Player already exists', 400);
    }

    let featuredProductIdsArray = [];
    if (featuredProductsIds) {
        if (typeof featuredProductsIds === 'string') {
            featuredProductIdsArray = [featuredProductsIds];
        } else if (Array.isArray(featuredProductsIds)) {
            featuredProductIdsArray = featuredProductsIds;
        }
    }

    const invalidFeaturedProductsIds = featuredProductIdsArray.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidFeaturedProductsIds.length > 0) {
        return sendResponse(res, `Invalid featured product IDs: ${invalidFeaturedProductsIds.join(', ')}`, 400);
    }

    if (featuredProductIdsArray.length > 0) {
        const featuredProducts = await Product.find({
            '_id': { $in: featuredProductIdsArray }
        });

        if (featuredProducts.length !== featuredProductIdsArray.length) {
            return sendResponse(res, "One or more products not found", 404);
        }
    }

    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath);
    if (!featuredImage) {
        return sendResponse(res, "Error uploading image to Cloudinary", 500);
    }

    const newFeaturedPlayer = await FeaturedPlayer.create({
        name: name,
        featuredImage: featuredImage,
        featuredProducts: featuredProductIdsArray
    });

    if (!newFeaturedPlayer) {
        return sendResponse(res, "Error while creating player", 500);
    }

    return sendResponse(res, "Player created successfully", 201, newFeaturedPlayer);
});



const removeFeaturedPlayer = asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const player = await FeaturedPlayer.findById(playerId);
    if (!player) {
        return sendResponse(res, 'Featured player not found', 404);
    }
    await Product.updateMany(
        { featuredPlayers: playerId },
        { $pull: { featuredPlayers: playerId } }
    );
    await FeaturedPlayer.findByIdAndDelete(playerId);
    return sendResponse(res, 'Featured player removed successfully', 200);
});

const editFeaturedPlayer = asyncHandler(async (req, res) => {
    const validAttributes = ['name', 'featuredImage', 'featuredProducts'];
    const { playerId } = req.params;
    const attributes = req.body;

    const player = await FeaturedPlayer.findById(playerId);
    if (!player) {
        return sendResponse(res, 'Featured player not found', 404);
    }

    const invalidAttributes = Object.keys(attributes).filter(key => !validAttributes.includes(key));
    if (invalidAttributes.length > 0) {
        return sendResponse(res, `Invalid attribute(s): ${invalidAttributes.join(', ')}`, 400);
    }

    if (req.files?.featuredImage) {
        const featuredImageLocalPath = req.files.featuredImage[0]?.path;
        if (!featuredImageLocalPath) {
            return sendResponse(res, "Featured image is required", 400);
        }

        const featuredImageUrl = await uploadOnCloudinary(featuredImageLocalPath);
        if (!featuredImageUrl) {
            return sendResponse(res, "Error uploading featured image", 500);
        }

        const deleteOldImage = await deleteFromCloudinaryByUrl(player.featuredImage);
        if (!deleteOldImage) {
            return sendResponse(res, "Error deleting old featured image", 500);
        }

        attributes.featuredImage = featuredImageUrl;
    }

    if (attributes.featuredProducts) {
        if (Array.isArray(attributes.featuredProducts)) {
            const invalidProductIds = attributes.featuredProducts.filter(id => !mongoose.Types.ObjectId.isValid(id));
            if (invalidProductIds.length > 0) {
                return sendResponse(res, `Invalid product IDs: ${invalidProductIds.join(', ')}`, 400);
            }

            const products = await Product.find({ '_id': { $in: attributes.featuredProducts } });
            if (products.length !== attributes.featuredProducts.length) {
                return sendResponse(res, "One or more products not found", 404);
            }
        } else {
            return sendResponse(res, "featuredProducts must be an array of product IDs", 400);
        }
    }

    const updatedPlayer = await FeaturedPlayer.findByIdAndUpdate(
        playerId,
        attributes,
        { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
        return sendResponse(res, "Error while updating player", 500);
    }

    return sendResponse(res, "Featured player updated successfully", 200, updatedPlayer);
});

const getAllFeaturedPlayers = asyncHandler(async (req, res) => {
    const featuredPlayers = await FeaturedPlayer.find()
        .select('name featuredImage');

    if (featuredPlayers.length === 0) {
        return sendResponse(res, "No featured players found", 404);
    }

    return sendResponse(res, "Featured players retrieved successfully", 200, featuredPlayers);
});

export { getFeaturedPlayer, addFeaturedPlayer, removeFeaturedPlayer, editFeaturedPlayer , getAllFeaturedPlayers};
