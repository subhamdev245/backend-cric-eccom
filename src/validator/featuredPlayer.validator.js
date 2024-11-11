import { body } from 'express-validator';
import mongoose from 'mongoose';

export const addFeaturedPlayerValidator = () => {
    return [
        body('name')
            .isString().withMessage('Name must be a string')
            .notEmpty().withMessage('Name is required')
            .trim()
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        
        body('featuredProducts')
            .optional()
            .isArray().withMessage('featuredProducts must be an array of ObjectIds')
            .custom(value => {
                if (value && value.length > 0) {
                    return value.every(item => mongoose.Types.ObjectId.isValid(item));
                }
                return true;
            })
            .withMessage('Each featuredProduct must be a valid ObjectId'),

        body('featuredImage')
            .isString().withMessage('featuredImage must be a string')
            .notEmpty().withMessage('featuredImage is required')
            .trim()
            .isURL().withMessage('featuredImage must be a valid URL'),
    ];
};

export const editFeaturedPlayerValidator = () => {
    return [
        body('name')
            .optional()
            .isString().withMessage('Name must be a string')
            .trim()
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

        body('featuredProducts')
            .optional()
            .isArray().withMessage('featuredProducts must be an array of ObjectIds')
            .custom(value => {
                if (value && value.length > 0) {
                    return value.every(item => mongoose.Types.ObjectId.isValid(item));
                }
                return true;
            })
            .withMessage('Each featuredProduct must be a valid ObjectId'),

        body('featuredImage')
            .optional()
            .isString().withMessage('featuredImage must be a string')
            .trim()
            .isURL().withMessage('featuredImage must be a valid URL'),
    ];
};