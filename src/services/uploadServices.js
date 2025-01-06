const { uploadVideo } = require("../utilities/cloudinaryHelper");
const Listing = require("../models/listing");

const uploadFirstVideoService = async (filePath, listing_id) => {
  try {
    const result = await uploadVideo(filePath);
    console.log("[UPLOADING TO CLOUDINARY RESULT]:", result);

    const updatedListingResult = await Listing.update(
      {
        upload_first_image: result.url,
      },
      {
        where: {
          listing_id: listing_id,
        },
      }
    );

    console.log("[updated entity]:",updatedListingResult);
    return {
      status: result?.status,
      message: result?.message,
      result: updatedListingResult,
    };
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Some interruption has occurred",
      result: null,
    };
  }
};

const updateListingService = async (listing_id, data) => {
  try {
    const result = await Listing.update(data, {
      where: {
        listing_id: listing_id,
      },
    });
    console.log("[result]:", result);
    return {
      status: 200,
      message: "Successfully updated the listing service",
      result: result,
    };
  } catch (err) {
    console.log("[ERROR]:", err);
    return {
      status: 500,
      message: "Internal Sever Error",
      result: null,
    };
  }
};

const getListingService = async ({listing_id}) => {
    try {
        const result = await Listing.findOne(
            {
                where: {
                    listing_id: listing_id
                }
            }
        );
        console.log("[RESULT FOUND LISTING]:",result);
        return {
            status : 200,
            message: "Successfully fetched a listing",
            data: result
        }
    } catch (err) {
        console.log("[ERR]:",err);
        return {
            status: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

module.exports = {
  uploadFirstVideoService,
  updateListingService,
  getListingService
};
