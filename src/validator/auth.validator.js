import { body } from "express-validator";

const registerUserValidator = [
    body('name')
        .notEmpty().withMessage('Name is required.'),
    
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .notEmpty().withMessage('Email is required.'),
    
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 7 }).withMessage('Password must be at least 7 characters long.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character.'),
];
const loginUserValidator = [
    body('email')
        .isEmail().withMessage('Invalid email format.')
        .notEmpty().withMessage('Email is required.'),
    
    body('password')
        .notEmpty().withMessage('Password is required.')
        
];

export {
    registerUserValidator,
    loginUserValidator
}