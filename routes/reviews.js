const express=require('express')
const router=express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review.js')
const {campgroundSchema , reviewSchema }=require('../schemas.js')
const Campground= require('../models/campground')
const {validateReview, islogedin}=require('../middleware.js')
const {isReviewAuthor}=require('../middleware.js')
const reviews=require('../controllers/reviews.js')


router.post('/',islogedin, validateReview, reviews.uploadreview)

router.delete('/:reviewId',islogedin,isReviewAuthor, reviews.deletereviews)

module.exports=router;
