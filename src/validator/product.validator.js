import { body } from 'express-validator';

const createProductValidation = () => {
    return [
        body('description')
            .notEmpty().withMessage('Description is required.')
            .isString().withMessage('Description must be a string.'),
            
        body('mainImage')
            .notEmpty().withMessage('Main image is required.')
            .isString().withMessage('Main image must be a string.'),
            
        body('name')
            .notEmpty().withMessage('Name is required.')
            .isString().withMessage('Name must be a string.'),
            
        body('price')
            .notEmpty().withMessage('Price is required.')
            .isNumeric().withMessage('Price must be a number.'),
            
        body('stock')
            .notEmpty().withMessage('Stock is required.')
            .isNumeric().withMessage('Stock must be a number.'),
            
        body('subImages')
            .notEmpty().withMessage('Sub-images are required.')
            .isArray().withMessage('Sub-images must be an array.')
            .custom((value) => {
                value.forEach(img => {
                    if (typeof img !== 'string') {
                        throw new Error('Each sub-image must be a string.');
                    }
                });
                return true;
            }),
    ];
};

const editProductValidation = () => {
    return [
        body('description')
            .optional()
            .isString().withMessage('Description must be a string.'),
            
        body('mainImage')
            .optional()
            .isString().withMessage('Main image must be a string.'),
            
        body('name')
            .optional()
            .isString().withMessage('Name must be a string.'),
            
        body('price')
            .optional()
            .isNumeric().withMessage('Price must be a number.'),
            
        body('stock')
            .optional()
            .isNumeric().withMessage('Stock must be a number.'),
            
        body('subImages')
            .optional()
            .isArray().withMessage('Sub-images must be an array.')
            .custom((value) => {
                value.forEach(img => {
                    if (typeof img !== 'string') {
                        throw new Error('Each sub-image must be a string.');
                    }
                });
                return true;
            }),
    ];
};

export {
    createProductValidation,editProductValidation
}