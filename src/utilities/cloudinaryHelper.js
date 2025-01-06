
const cloudinary = require("../../configurations/cloudinary");

const path = require("path");   
const fs = require("fs");

const uploadVideo = async (filePath, folder = "MWT-files") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", 
      folder: folder, 
    });
    return { status: 200, url: result.secure_url, public_id: result.public_id , message: "Successfully uploaded"};
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { status: 500, message: "Internal server error", url: null, public_id: null};
  }
};


const getSingleVideo = async (public_id) => {
    try {
      const result = await cloudinary.api.resource(public_id, {
        resource_type: "video",
      });
  
      return {
        success: true,
        video: {
          public_id: result.public_id,
          url: result.secure_url,
          created_at: result.created_at,
          bytes: result.bytes,
          format: result.format,
          duration: result.duration,
        },
      };
    } catch (error) {
      console.error("Cloudinary fetch error:", error);
      return { success: false, error: error.message };
    }
};
  
module.exports = {
    uploadVideo,
    getSingleVideo
}