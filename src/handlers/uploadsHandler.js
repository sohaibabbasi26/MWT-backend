const services = require("../services/uploadServices");
const { sequelize } = require('../../configurations/sequelizePgSQL')
const Listing = require("../models/listing");
const path = require('path');
const fs = require('fs');

const handleFirstVideoUpload = async (request, response) => {
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
            const resultFromCloudinaryAndDb = await services.uploadFirstVideoService(tempFilePath);
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
        const { location } = request.body;
        const result = await Listing.create({ location });
        response.status(200).send({
            status: 500,
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

module.exports = {
    handleFirstVideoUpload,
    createListingHandler
}