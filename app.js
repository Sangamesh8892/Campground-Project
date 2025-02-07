if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express= require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const methodOverride = require('method-override')
const ejsMate=require('ejs-mate')
const campgrounds=require('./routes/campground.js')
const reviews=require('./routes/reviews.js')
const session=require('express-session')
const flash=require('connect-flash')
const ExpressError=require('./utils/ExpressError')
const passport=require('passport')
const localpassport=require('passport-local')
const User=require('./models/user.js')
const userRoutes=require('./routes/users.js')
const mongoSanitize=require('express-mongo-sanitize')
const MongoStore = require('connect-mongo');
const dbUrl=process.env.DB_URL
// process.env.DB_URL

mongoose.connect(dbUrl);
// mongodb://127.0.0.1:27017/yelpcamp
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once('open',()=>{
    console.log('DB Connected')
})

app.use(express.urlencoded({extended : true}))
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))

app.use(methodOverride('_method'))
app.use(mongoSanitize())

app.engine('ejs',ejsMate)






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:'secret'
    },
    touchAfter:24*60*60
});
store.on('error', function (e){
    console.log('Session store Eroor')
})
const sessionconfig={
    store,
    name:'session',
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 1000*50*50*24*8,
        httpOnly:true,
        // secure:true  no to be used in localhost , bcz it only works over https
        
    }

}
app.use(session(sessionconfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localpassport(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(flash());
app.use((req,res,next)=>{
    res.locals.CLOUDINARY_CLOUD_NAME=process.env.CLOUDINARY_API_KEY
    res.locals.CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY
    res.locals.MAPTILER_KEY = process.env.MAPTILER_KEY;
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})
app.get('/', (req,res)=>{
    res.render('home.ejs')
})
app.use('/',userRoutes)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use(express.static(path.join(__dirname,'public')))


app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})

app.use((err,req,res,next)=>{
    const {statuscode=500}=err;
    res.status(statuscode).render('error',{err})
    if(!err.message) err.message="Something went Wrong!!"

})