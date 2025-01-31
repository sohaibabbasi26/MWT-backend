const services = require("../services/uploadServices");
const { sequelize } = require('../../configurations/sequelizePgSQL')
const Listing = require("../models/listing");
const path = require('path');
const fs = require('fs');
const { uploadImage } = require("../utilities/cloudinaryHelper");


const handleFirstVideoUpload = async (request, response) => {
    let tempFilePath = null;
    try {
        const parts = request.parts();
        let listing_id = null;

        console.log("[PARTS]:",parts);

        for await (const part of parts) {
            if (part.file) {
                const tempDir = path.join(__dirname, "uploads");
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                tempFilePath = path.join(tempDir, part.filename);

                const writeStream = fs.createWriteStream(tempFilePath);
                await new Promise((resolve, reject) => {
                    part.file.pipe(writeStream);
                    part.file.on("end", resolve);
                    part.file.on("error", reject);
                });

                console.log("[SUCCESSFULLY UPLOADED FILE TO BACKEND FOLDER]:", tempFilePath);
            } else if (part.fieldname === "listing_id") {
                listing_id = part.value;
                console.log("[LISTING ID]:", listing_id);
            }
        }

        console.log("[LISTING ID]:",listing_id);

        if (!listing_id || !tempFilePath) {
            return response.status(400).send({
                status: 400,
                message: "Missing listing_id or file in the request.",
                listing: null
            });
        } else {
            const resultFromCloudinaryAndDb = await services.uploadFirstVideoService(tempFilePath, listing_id);
            return response.status(200).send({
                status: resultFromCloudinaryAndDb.status,
                message: resultFromCloudinaryAndDb.message,
                listing: resultFromCloudinaryAndDb.result
            })
        }

    } catch (err) {
        console.log("[ERROR]:", err);
        response.status(500).send({
            status: 500,
            message: "Some interruption occurred while uploading the video",
            result: null
        })
    } finally {
        fs.unlinkSync(tempFilePath);
        console.log("[SUCCESSFULLY DELETED TEMPORARY FILE]");
    }
}

const handleSecondVideoUpload = async (request, response) => {
    let tempFilePath = null;
    try {
        const parts = request.parts();
        let listing_id = null;

        for await (const part of parts) {
            if (part.file) {
                const tempDir = path.join(__dirname, "uploads");
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                tempFilePath = path.join(tempDir, part.filename);

                const writeStream = fs.createWriteStream(tempFilePath);
                await new Promise((resolve, reject) => {
                    part.file.pipe(writeStream);
                    part.file.on("end", resolve);
                    part.file.on("error", reject);
                });

                console.log("[SUCCESSFULLY UPLOADED FILE TO BACKEND FOLDER]:", tempFilePath);
            } else if (part.fieldname === "listing_id") {
                listing_id = part.value;
                console.log("[LISTING ID]:", listing_id);
            }
        }

        if (!listing_id || !tempFilePath) {
            return response.status(400).send({
                status: 400,
                message: "Missing listing_id or file in the request.",
                listing: null
            });
        } else {
            const resultFromCloudinaryAndDb = await services.uploadSecondVideoService(tempFilePath, listing_id);
            return response.status(200).send({
                status: resultFromCloudinaryAndDb.status,
                message: resultFromCloudinaryAndDb.message,
                listing: resultFromCloudinaryAndDb.result
            })
        }
    } catch (err) {
        console.log("[ERROR]:", err);
        request.status(500).send({
            status: 500,
            message: "Some interruption occurred while uploading the video",
            result: null
        })
    } finally {
        fs.unlinkSync(tempFilePath);
        console.log("[SUCCESSFULLY DELETED TEMPORARY FILE]");
    }
}


const createListingHandler = async (request, response) => {
    try {
        const data = request.body;
        console.log("[BODY]:", data);
        const result = await Listing.create(data);
        response.status(200).send({
            status: 200,
            message: "Successful",
            listing: result
        })

    } catch (err) {
        console.log("[ERROR]:", err);
        response.status(500).send({
            status: 500,
            message: "Internal Server Error",
            listing: null
        })
    }
}

const updateListing = async (request, response) => {
    try {
        const { listing_id, data } = request.body;
        console.log("[BODY]:", data);
        const result = await services.updateListingService(listing_id, data);
        response.status(200).send({
            status: result.status,
            message: result.message,
            result: result.result
        });
    } catch (err) {
        console.log("[ERROR]:", err);
        response.status(500).send({
            status: 500,
            message: "Internal Sever Error",
            result: null
        });
    }
}

const getListing = async (request, response) => {
    try {
        const { listing_id } = request.params;
        console.log("[listing id]:", listing_id);
        const result = await services.getListingService({ listing_id });
        response.status(result.status).send({
            status: result.status,
            message: result.message,
            data: result.data
        });

    } catch (err) {
        console.log("[ERROR]:", err);
        response.status(500).send({
            status: 500,
            message: "Internal Server Error",
            data: null
        });
    }
}

const getAllListings = async (request, response) => {
    try {
        const result = await services.getAllListingsService();
        response.status(result?.status).send({
            status: result?.status,
            message: result?.message,
            listings: result?.listings
        })
    } catch (err) {
        console.log("[ERROR]:",err);
        response.status(500).status({
            status: 500,
            message: "Some internal server error has occurred",
            listings: null
        })
    }
}

const postListingImagesHandler = async (request, response) => {
    let listing_id;
    try {
        const parts = request.parts();
        const uploadedUrls = [];

        for await (const part of parts) {
            if (part.file) {
                const tempDir = path.join(__dirname, "uploads");
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                const tempFilePath = path.join(tempDir, part.filename);
                const writeStream = fs.createWriteStream(tempFilePath);

                await new Promise((resolve, reject) => {
                    part.file.pipe(writeStream);
                    part.file.on("end", resolve);
                    part.file.on("error", reject);
                });


                const uploadResult = await uploadImage(tempFilePath);

                if (uploadResult.success) {
                    uploadedUrls.push(uploadResult.url);
                } else {
                    console.error("[UPLOAD FAILED]:", uploadResult.error);
                }
                fs.unlinkSync(tempFilePath);


            } else if (part.fieldname === "listing_id") {
                listing_id = part.value;
            }
        }

        if (uploadedUrls.length > 0) {
            const updateListing = await Listing.update({
                uploaded_images: uploadedUrls
            },
                {
                    where: {
                        listing_id: listing_id
                    }
                }
            );

            console.log("[updated listing result]:", updateListing);
            response.status(200).send({
                status: 200,
                message: "Uploaded all the images to cloudinary",
                data: updateListing
            });
        } else {
            return {
                status: 500,
                message: "Couldn't upload the images, please check the server logs.",
                data: null
            }
        }
    } catch (err) {
        console.log("[ERROR]:", err);
        response.status(500).send({
            status: 500,
            message: "Internal Server Error",
            data: null
        });
    }
}

const getAllInstagramPosts = async (request, response) => {
    try {
        const result = await services.getAllInstagramPostsService();
        return {
            status: result?.status,
            message: result?.message,
            data: result?.data
        }
    } catch (err) {
        console.log("[ERROR]:",err);
        response.status(500).send({
            status: 500,
            message: "Couldn't get the instagram posts",
            data: null
        })
    }
}

const updateAutoSocialEntities = async  (request, response) => {
    try {
        const { mediaIds, facebookPosts, listing_id } = request.body;
        console.log("[LISTING ID]:",listing_id);
        const result = await services.updateAutoSocialEntitiesService(mediaIds, facebookPosts, listing_id);
        response.status(result?.status).send({
            status: result.status,
            message: result.message,
            instaInsights: result.instaInsights,
            fbInsights: result?.fbInsights,
            totalViews: result?.totalViews,
            totalEngagements: result?.totalEngagements,
            totalInterestedBuyers: result?.totalInterestedBuyers,
            updatedListingEntry:  result?.updatedListingEntry
        });

    } catch (err) {
        console.log("[ERROR]:",err);
        response.status(500).send({
            status: 500,
            message: "Couldn't update the automatic social entities",
            data: null
        })
    }
}

const getFbPagePosts = async (request, response) => {
    try {
        const result = await services.getFbPagePostsService();
        return {
            status: result?.status,
            message: result?.message,
            posts: result?.posts
        }
    } catch (err) {
        console.log("[ERROR]:",err);
        response.status(500).send({
            status: 500,
            message: "Couldn't fetch all the posts.",
            posts: null
        })
    }
}
// const 

module.exports = {
    handleFirstVideoUpload,
    createListingHandler,
    updateListing,
    getListing,
    handleSecondVideoUpload,
    postListingImagesHandler,
    getAllListings,
    getAllInstagramPosts,
    updateAutoSocialEntities,
    getFbPagePosts
}


// https://graph.facebook.com/v21.0/261586003895564/posts?fields=id,message,created_time,insights.metric(post_impressions_unique)&access_token=EAATS2AmQq28BO4XnhqqcCFS51NACHMlDroVap3QV8bCvN5ZAOnd1aT5ayZCfBrkZC4IlO9O3nC7fZBQs6BlZCkwQQ3TQSYmnZCcBroa2ZA6ZBAGncOZBZBVMggOpJZBvz7DYuhbzjgInR5DavdYFqxtcmzX1xNFz6I0q1kmdjuleJTEvc5Guo9XEHBWTWbf40uqnha4ndc83GGThnexlMrbbIRE