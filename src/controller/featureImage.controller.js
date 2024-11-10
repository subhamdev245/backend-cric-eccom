import { FeatureImage } from "../models/featureImage.models";
import { FeaturedPlayer } from "../models/featureplayer.models";
import { Product } from "../models/products.models";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import sendResponse from "../utils/sendResponse";


const createFeaturedImage = asyncHandler(async (req, res) => {
    const { imageUrl, altText, relatedToPlayer, relatedToProduct } = req.body;
    if (!relatedToPlayer && !relatedToProduct) {
        return sendResponse(res, "Either relatedToPlayer or relatedToProduct must be provided", 400);
    }
    if (relatedToPlayer) {
        const playerExists = await Player.findById(relatedToPlayer);
        if (!playerExists) {
            return sendResponse(res, "Invalid Player ID", 400);
        }
    }
    if (relatedToProduct) {
        const productExists = await Product.findById(relatedToProduct);
        if (!productExists) {
            return sendResponse(res, "Invalid Product ID", 400);
        }
    }
    const imageLocalPath = req.files?.imageUrl?.[0]?.path;
    if (!imageLocalPath) {
        return sendResponse(res, "Image is required", 400);
    }
    const imageUrlCloudinary = await uploadOnCloudinary(imageLocalPath);

    if (!imageUrlCloudinary) {
        return sendResponse(res, "Error uploading image", 500);
    }
    const newFeaturedImage = await FeatureImage.create({
        imageUrl: imageUrlCloudinary,
        altText,
        relatedToPlayer: relatedToPlayer || undefined,  
        relatedToProduct: relatedToProduct || undefined,  
    });

    if (!newFeaturedImage) {
        return sendResponse(res, "Error while creating Featured Image", 501);
    }

    // Return success response
    return sendResponse(res, "Featured Image Created", 201, newFeaturedImage);

})

const getFeaturedImages = asyncHandler(async (req, res) => {
    
      const featureImages = await FeatureImage.find()
        .populate('relatedToPlayer')  
        .populate('relatedToProduct');  
  
      if (!featureImages || featureImages.length === 0) {
        return sendResponse(res, "No featured images found", 404);
      }
  
      return sendResponse(res, "Featured images fetched successfully", 200, featureImages);
   
  });


const deleteFeaturedImage = asyncHandler(async (req, res) => {
    const { featureImageId } = req?.params;  
  
    
      
      const featureImage = await FeatureImage.findById(featureImageId);
  
      if (!featureImage) {
        return sendResponse(res, "Featured image not found", 404);
      }
  
      
      await FeatureImage.findByIdAndDelete(featureImageId);
  
      return sendResponse(res, "Featured image deleted successfully", 200);
    } 
  );
  
export{
    createFeaturedImage,
    deleteFeaturedImage,
    getFeaturedImages
}