

import { body, validationResult } from 'express-validator';



export const validateOrder = () => [
    body('customer')
        .isMongoId().withMessage('Invalid customer ID.'),
    
    body('items')
        .isArray().withMessage('Items must be an array.')
        .custom((items) => {
            if (items.length === 0) {
                throw new Error('Items array cannot be empty.');
            }
            return true;
        })
        .custom((items) => {
            items.forEach(item => {
                if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
                    throw new Error('Invalid product ID in items.');
                }
                if (item.quantity < 1) {
                    throw new Error('Quantity must be at least 1.');
                }
                if (typeof item.price !== 'number' || item.price <= 0) {
                    throw new Error('Price must be a positive number.');
                }
            });
            return true;
        }),

    body('totalQuantity')
        .isNumeric().withMessage('Total quantity must be a number.')
        .isInt({ min: 1 }).withMessage('Total quantity must be at least 1.'),
    
    body('orderPrice')
        .isNumeric().withMessage('Order price must be a number.')
        .isFloat({ gt: 0 }).withMessage('Order price must be greater than 0.'),
    
    body('address.addressLine1')
        .notEmpty().withMessage('Address line 1 is required.'),
    
    body('address.addressLine2')
        .optional() 
        .isString().withMessage('Address line 2 must be a string.'),
    
    body('address.city')
        .notEmpty().withMessage('City is required.'),
    
    body('address.country')
        .notEmpty().withMessage('Country is required.'),
    
    body('address.pincode')
        .notEmpty().withMessage('Pincode is required.'),
    
    body('address.state')
        .notEmpty().withMessage('State is required.'),
];