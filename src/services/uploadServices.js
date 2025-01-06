const { uploadVideo } = require("../utilities/cloudinaryHelper");


const uploadFirstVideoService = async (filePath) => {
    try {
        const result = await uploadVideo(filePath);
        console.log("[UPLOADING TO CLOUDINARY RESULT]:",result);
        return {
            status : result?.status,
            message: result?.message,
            result: result    
        }
    } catch (err) {
        console.log('[ERR]:',err);
        return {
            status: 500,
            message: "Some interruption has occurred",
            result: null
        }
    }
}

module.exports =  {
    uploadFirstVideoService
}