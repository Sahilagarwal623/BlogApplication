const path = require('path');

const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(filepath) {


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
    return {
        secure_url: uploadResult.secure_url,
        image_id: uploadResult.public_id,
    }
}

async function deleteAsset(public_id) {
    await cloudinary.uploader
        .destroy(public_id)
        .then(result => console.log(result));
}

module.exports = {
    uploadImage,
    deleteAsset,
}