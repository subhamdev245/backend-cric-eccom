import sendResponse from "../utils/sendResponse";



const addFeaturedPlayerValidationMiddleware = (req, res, next) => {
    const { name, featuredProductsIds } = req.body;
    const featuredImageLocalPath = req.files?.featuredImage?.[0]?.path;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return sendResponse(res, 'Name is required and must be a string.', 400);
    }

    if (!featuredImageLocalPath) {
        return sendResponse(res, 'Featured image is required.', 400);
    }

    if (featuredProductsIds) {
        if (typeof featuredProductsIds === 'string' && featuredProductsIds.trim() !== '') {
            featuredProductsIds = [featuredProductsIds];
        } else if (!Array.isArray(featuredProductsIds) || featuredProductsIds.length === 0) {
            return sendResponse(res, 'Featured products must be a non-empty array or a valid string.', 400);
        }

        // Validate each product ID
        const invalidProductIds = featuredProductsIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidProductIds.length > 0) {
            return sendResponse(res, `Invalid product IDs: ${invalidProductIds.join(', ')}`, 400);
        }
    }

    next();
};

const editFeaturedPlayerValidationMiddleware = (req, res, next) => {
    const { name, featuredProductsIds } = req.body;
    const featuredImageLocalPath = req.files?.featuredImage?.[0]?.path;

    if (name && (typeof name !== 'string' || name.trim() === '')) {
        return sendResponse(res, 'Name must be a valid string if provided.', 400);
    }

    if (featuredImageLocalPath && !featuredImageLocalPath.startsWith('image/')) {
        return sendResponse(res, 'Featured image must be an image file if provided.', 400);
    }

    if (featuredProductsIds) {
        if (typeof featuredProductsIds === 'string' && featuredProductsIds.trim() !== '') {
            featuredProductsIds = [featuredProductsIds];
        } else if (!Array.isArray(featuredProductsIds) || featuredProductsIds.length === 0) {
            return sendResponse(res, 'Featured products must be a non-empty array or a valid string if provided.', 400);
        }

        // Validate each product ID
        const invalidProductIds = featuredProductsIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidProductIds.length > 0) {
            return sendResponse(res, `Invalid product IDs: ${invalidProductIds.join(', ')}`, 400);
        }
    }

    next();
};

export {
    addFeaturedPlayerValidationMiddleware,
    editFeaturedPlayerValidationMiddleware
}