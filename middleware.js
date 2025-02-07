
const Campground = require('./models/campground');
const {campgroundSchema , reviewSchema }=require('./schemas.js')
const catchAsync = require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
const Review = require('./models/review.js')



module.exports.validatecampground=(req,res,next)=>{
    
    const {error} =campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}
module.exports.islogedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','Login in first')
        return res.redirect('/login')
    }
    next();
}
module.exports.storeReturnTo= (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next()
}

module.exports.isAuthor= async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to access')
        return res.redirect(`/campgrounds/${id}`);

    }
    next()
}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
        if(error){
            const msg=error.details.map(el=>el.message).join(',');
            throw new ExpressError(msg,400)
        }
        else{
            next();
        }

}
module.exports.isReviewAuthor= async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission to access')
        return res.redirect(`/campgrounds/${id}`);

    }
    next()
}