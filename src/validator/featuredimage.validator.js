import { body } from "express-validator";

export const createFeaturedImageValidatore = () => {
    return [
    body('imageUrl')
    .isURL().withMessage('imageUrl must be a valid URL')
    .notEmpty().withMessage('imageUrl is required'),
    body('altText')
    .isString().withMessage('altText must be a string')
    .notEmpty().withMessage('altText is required'),
    body('relatedToPlayer')
    .optional() 
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('relatedToPlayer must be a valid ObjectId'),
    body('relatedToProduct')
    .optional() // This can be optional since it might not always be set
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('relatedToProduct must be a valid ObjectId'),
    ]
}