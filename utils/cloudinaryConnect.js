const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: "dk0sizdni",
    api_key: "683345218126387",
    api_secret: "YC1zg1b9i-rtqKl1_T0rnjjSyQ0"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images",
        format: async (req, file) => "png",
    }
});

const parser = multer({storage: storage});

module.exports= parser;