import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
       try {
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type : "image"
            })
            fs.unlinkSync(localFilePath)
            return {
                public_id : response.public_id,
                img_url : response.url
            }

       } catch (error) {
         fs.unlinkSync(localFilePath)
         return null
       }    
}
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
            return { success: true, message: 'File deleted successfully!' };
        } else {
            return { success: false, message: 'File not found or could not be deleted.' };
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, message: 'Error occurred during deletion.' };
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}