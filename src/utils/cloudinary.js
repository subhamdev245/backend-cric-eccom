import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
        });
        fs.unlinkSync(localFilePath);
        return response.secure_url;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error('Upload error:', error);
        return null;
    }
};

const deleteFromCloudinaryByUrl = async (imgUrl) => {
    try {
        const publicId = imgUrl.split('/').slice(-1)[0].split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok' ? { success: true, message: 'File deleted successfully!' } : { success: false, message: 'File not found or could not be deleted.' };
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, message: 'Error occurred during deletion.' };
    }
};

export { uploadOnCloudinary, deleteFromCloudinaryByUrl };
