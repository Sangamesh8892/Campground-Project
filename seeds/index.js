const express= require('express')
const app=express()
const cities=require('./cities')
const path=require('path')
const mongoose=require('mongoose')
const Campground= require('../models/campground')
const {places , descriptors} = require('./seedHelpers')
const price=Math.floor(Math.random() * 30) +10

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once('open',()=>{
    console.log('DB Connected')
})

const sample= array => array[Math.floor(Math.random() * array.length)]
     

const seedDB= async ()=>{
    await Campground.deleteMany({})
    for(let i=0; i<50;i++){
        const random1000 =Math.floor(Math.random() * 1000)
        const camp=new Campground({
            author:'67a1d5a01b8440ca90249ace',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[{
                url: 'https://res.cloudinary.com/drrvi35dy/image/upload/v1738846635/YelpCamp/xztjzborykpt5bjwx8as.jpg',
                filename: 'YelpCamp/xztjzborykpt5bjwx8as',
              },
              {
                url: 'https://res.cloudinary.com/drrvi35dy/image/upload/v1738846639/YelpCamp/sonm6tml4l7nr4ygr6fg.jpg',
                filename: 'YelpCamp/sonm6tml4l7nr4ygr6fg',
              }],
            description:'Campground Description',
            price

        })
        await camp.save()
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})
