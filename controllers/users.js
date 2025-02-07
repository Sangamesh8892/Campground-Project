const catchAsync=require('../utils/catchAsync')
const User=require('../models/user')
const ExpressError=require('../utils/ExpressError')
const passport = require('passport')
const { storeReturnTo}=require('../middleware')


module.exports.registeruser=catchAsync(async (req,res)=>{
    try{    

        const {username,email,password}=req.body;
        const newuser= new User({email,username})
        const reguser=await User.register(newuser,password)
        req.login(reguser,e=>{
            if(e)  return next(e)
        req.flash('success','Welcome to Yelpcamp')
        res.redirect('/campgrounds')})
    }
catch(e){
    req.flash('error',e.message)
    res.redirect('register')
}
   
})

module.exports.sessiontrack=async (req,res)=>{
    req.flash('success','Welcome Back')
    const redirecturl=res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirecturl)
}

module.exports.userlogout=(req,res,next)=>{
    req.logout((e)=>{
        if(e){
            return next(e)
        }
        req.flash('success','Succefully Signed out')
        res.redirect('/campgrounds');
    })
}