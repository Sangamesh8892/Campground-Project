const express=require('express')
const router=express.Router({mergeParams:true})
const users=require('../controllers/users')
const passport = require('passport')
const { storeReturnTo}=require('../middleware')


router.get('/register',(req,res)=>{
    res.render('users/register')   
})

router.post('/register', users.registeruser)
router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.sessiontrack)


router.get('/logout',users.userlogout)

module.exports=router;