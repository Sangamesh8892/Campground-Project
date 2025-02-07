const express=require('express')
const router=express.Router()
const multer=require('multer')
const {storage}=require('../cloudinary/index.js')
const upload=multer({storage});
const catchAsync = require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground= require('../models/campground')
const {campgroundSchema , reviewSchema }=require('../schemas.js')
const { islogedin }=require('../middleware.js')
const {isAuthor}=require('../middleware.js')
const {validatecampground}=require('../middleware.js')
const campgrounds=require('../controllers/campground.js')
const { route } = require('./campground.js');



router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(islogedin,upload.array('images'),validatecampground, campgrounds.createnewcampground)
router.get('/new',islogedin, campgrounds.rendernewform)
router.route('/:id')
.get( campgrounds.showcampground)
.put(islogedin,isAuthor,upload.array('images'),validatecampground, campgrounds.updatecampgroundedit)
.delete(islogedin,isAuthor,campgrounds.deletecamgrounds)


router.get('/:id/edit',islogedin, isAuthor, campgrounds.editcampground)




module.exports = router;