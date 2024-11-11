import { FeaturedPlayer } from "../models/featureplayer.models";
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
    const { name, featuredImage, featuredProducts } = req.body;
    const existingPlayer = await FeaturedPlayer.findOne({ name });
    if (existingPlayer) {
        return sendResponse(res, 'Player already exists', 400);
    }
    const newPlayer = await FeaturedPlayer.create({
        name,
        featuredImage,
        featuredProducts,
    });
    return sendResponse(res, 'Featured player added successfully', 201, newPlayer);
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
    const { playerId } = req.params;
    const { name, featuredImage, featuredProducts } = req.body;
    const player = await FeaturedPlayer.findById(playerId);
    if (!player) {
        return sendResponse(res, 'Featured player not found', 404);
    }
    const updatedPlayer = await FeaturedPlayer.findByIdAndUpdate(
        playerId,
        { name, featuredImage, featuredProducts },
        { new: true, runValidators: true }
    );
    return sendResponse(res, 'Featured player updated successfully', 200, updatedPlayer);
});

export { getFeaturedPlayer, addFeaturedPlayer, removeFeaturedPlayer, editFeaturedPlayer };
