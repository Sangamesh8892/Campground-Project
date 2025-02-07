const { fileLoader } = require('ejs')
const campground = require('../models/campground')
const Campground= require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const { cloudinary } = require('../cloudinary')


module.exports.index = async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })

}

module.exports.rendernewform=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createnewcampground =catchAsync(async (req,res,next)=>{
           const campground=new Campground(req.body.campground) 
           campground.images=req.files.map(f=>({url:f.path,filename:f.filename}))
           campground.author=req.user 
           await campground.save()
           req.flash('success','Successfully made a new campground!')
        res.redirect(`campgrounds/${campground._id}`)
            
           
})

module.exports.showcampground = catchAsync(async(req,res)=>{
    const { id }=req.params;
    const campground= await Campground.findById(id).populate({path:'reviews',populate:{
        path:'author'
    }}).populate('author');
    res.render('campgrounds/show', {campground})
    
})

module.exports.editcampground= catchAsync(async (req,res)=>{
    const { id }=req.params;
    const campground= await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

module.exports.updatecampgroundedit =  catchAsync(async (req, res) => {
    const {id} = req.params;
    const update=await Campground.findByIdAndUpdate(id ,{...req.body.campground})
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    update.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
             await cloudinary.uploader.destroy(filename)
        }
       await update.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    await update.save();
    res.redirect(`/campgrounds/${id}`)
})
module.exports.deletecamgrounds=catchAsync(async (req,res)=>{
    const {id} = req.params;
    const d=await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted the campground')
    res.redirect('/campgrounds')
})