const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET

})

const storage=new CloudinaryStorage({
    cloudinary,
    limits: { fileSize: 20 * 1024 * 1024 },
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpeg','png','jpg'],
        max_file_size: 20 * 1024 * 1024
    }
  
})
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports={
    cloudinary,
    storage,
    upload
}