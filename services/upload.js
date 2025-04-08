const path = require('path');

const cloudinary = require('cloudinary').v2;

async function uploadImage(filepath) {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Upload an image
    const image = path.join(__dirname, '../public', filepath);
    const uploadResult = await cloudinary.uploader
        .upload(image, {
            folder: 'uploads'
        })
        .catch((error) => {
            console.log(error);
        });

    console.log(uploadResult);
    return uploadResult.secure_url;

}

module.exports = {
    uploadImage,
}