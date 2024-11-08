import { Product } from '../models/products.models';
import { EcomProfile } from '../models/profile.models';
import { Review } from '../models/review.models';
import sendResponse from '../utils/sendResponse';
import asyncHandler from '../utils/asyncHandler';

const createReview = asyncHandler(async (req, res) => {
    const { reviewFor, reviewBy, star, review } = req.body;
  

    const product = await Product.findById(reviewFor);
    if (!product) {
      return sendResponse(res, 'Invalid product', 400);
    }
  
    const user = await EcomProfile.findById(reviewBy);
    if (!user) {
      return sendResponse(res, 'Invalid user', 400);
    }
  
    
    const existingReview = await Review.findOne({ reviewFor, reviewBy });
    if (existingReview) {
      return sendResponse(res, 'You have already reviewed this product', 400);
    }
  
    
    const newReview = await Review.create({
      reviewFor,
      reviewBy,
      star,
      review
    });
  
    if (!newReview) {
      return sendResponse(res, 'Error creating review', 500);
    }
  
    return sendResponse(res, 'Review created successfully', 201, newReview);
  });

const getReviewsForProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
  
    const reviews = await Review.find({ reviewFor: productId })
      .populate('reviewBy', 'name email') 
      .select('-__v'); 
  
    if (!reviews || reviews.length === 0) {
      return sendResponse(res, 'No reviews found for this product', 404);
    }
  
    return sendResponse(res, 'Reviews fetched successfully', 200, reviews);
});

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { star, review } = req.body;
  
    
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return sendResponse(res, 'Review not found', 404);
    }
  
    
    if (existingReview.reviewBy.toString() !== req.user._id.toString()) {
      return sendResponse(res, 'You can only update your own review', 403);
    }
  
    
    existingReview.star = star !== undefined ? star : existingReview.star;
    existingReview.review = review || existingReview.review;
  
    const updatedReview = await existingReview.save();
  
    return sendResponse(res, 'Review updated successfully', 200, updatedReview);
  });
  

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
  
    
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return sendResponse(res, 'Review not found', 404);
    }
  
    
    if (existingReview.reviewBy.toString() !== req.user._id.toString()) {
      return sendResponse(res, 'You can only delete your own review', 403);
    }
  
    
    await existingReview.remove();
  
    return sendResponse(res, 'Review deleted successfully', 200);
});


export {
    createReview,
    updateReview,
    deleteReview,
    getReviewsForProduct
}