const { uploadVideo } = require("../utilities/cloudinaryHelper");
const Listing = require("../models/listing");

const uploadFirstVideoService = async (filePath, listing_id) => {
  try {
    console.log("[FILE PATH URL]:",filePath);
    const check = await Listing.findOne({
      where: {
        listing_id: listing_id
      }
    });
    console.log("[CHECK IF THE LISTING EXISTS]:",check);

    if (check !== null) {
      console.log("[FILE PATH URL]:",filePath);
      const result = await uploadVideo(filePath);
      console.log("[UPLOADING TO CLOUDINARY RESULTANT URL]:", result.url);
      

  
      const updatedListingResult = await Listing.update(
        {
          uploaded_video_one: result.url,
        },
        {
          where: {
            listing_id: listing_id,
          },
        }
      );
  
      console.log("[updated entity]:", updatedListingResult);
      return {
        status: result?.status,
        message: result?.message,
        result: updatedListingResult,
      };
    } else {
      return {
        status: 404,
        message: "Listing was not found",
        result: null,
      };
    }

   
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Some interruption has occurred",
      result: null,
    };
  }
};

const uploadSecondVideoService = async (filePath, listing_id) => {
  try {
    const check = await Listing.findOne({
      where: {
        listing_id: listing_id
      }
    });

    if (check !== null) {
      const result = await uploadVideo(filePath);
      console.log("[UPLOADING TO CLOUDINARY RESULT]:", result);
  
      const updatedListingResult = await Listing.update(
        {
          uploaded_video_two: result.url,
        },
        {
          where: {
            listing_id: listing_id,
          },
        }
      );
  
      console.log("[updated entity]:", updatedListingResult);
      return {
        status: result?.status,
        message: result?.message,
        result: updatedListingResult,
      };
    } else {
      return {
        status: 404,
        message: "Listing was not found",
        result: null,
      };
    }

   
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

const getListingService = async ({ listing_id }) => {
  try {
    const result = await Listing.findOne(
      {
        where: {
          listing_id: listing_id
        }
      }
    );
    console.log("[RESULT FOUND LISTING]:", result);
    if (result === null) {
      return {
        status: 404,
        message: "Listing Not Found",
        data: null
      }
    } else {
      return {  
        status: 200,
        message: "Successfully fetched a listing",
        data: result
      }
    }
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    }
  }
}

const getAllListingsService = async () => {
  try {
    const result = await Listing.findAll();
    console.log("[RESULT FOUND LISTING]:", result);
    if (result.length === 0) {
      return {
        status: 404,
        message: "You don't have any listings yet",
        listings: null
      }
    } else {
      return {  
        status: 200,
        message: "Successfully fetched a listing",
        listings: result
      }
    }
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Internal Server Error",
      listings: null
    }
  }
}


module.exports = {
  uploadFirstVideoService,
  updateListingService,
  getListingService,
  uploadSecondVideoService,
  getAllListingsService
};
