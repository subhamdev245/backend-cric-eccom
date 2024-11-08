import { body, param } from "express-validator";

const validateCreateReview = () => {
    return
    [
        body('reviewFor')
            .isMongoId()
            .withMessage('Review must be for a valid product (ObjectId required)'),
        body('reviewBy')
            .isMongoId()
            .withMessage('Review must be submitted by a valid user (ObjectId required)'),
        body('star')
            .optional()
            .isInt({ min: 0, max: 5 })
            .withMessage('Star rating must be between 0 and 5'),
        body('review')
            .isString()
            .notEmpty()
            .withMessage('Review text is required')
    ]

}
const validateDeleteReview = () => {
    return [
        param('reviewId')
            .isMongoId()
            .withMessage('Review ID must be a valid MongoDB ObjectId')
    ];
};

const validateGetReviewsForProduct = () => {
    return [
        param('productId')
            .isMongoId()
            .withMessage('Product ID must be a valid MongoDB ObjectId')
    ];
};
const validateUpdateReview = () => {
    return [
        param('reviewId')
            .isMongoId()
            .withMessage('Review ID must be a valid MongoDB ObjectId'),
        body('star')
            .optional()
            .isInt({ min: 0, max: 5 })
            .withMessage('Star rating must be between 0 and 5'),
        body('review')
            .optional()
            .isString()
            .notEmpty()
            .withMessage('Review text is required')
    ];
};  

export {
    validateCreateReview,validateDeleteReview,validateUpdateReview,validateGetReviewsForProduct
}