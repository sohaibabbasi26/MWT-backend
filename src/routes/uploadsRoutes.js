const uploadsHandlers = require('../handlers/uploadsHandler');
const { getInstagramPostsInsights, getMediaIdFromUrl } = require('../utilities/getIntagramInsights');
// const authValidation = require('../pre-handlers/authValidation');

const routes = [
    {
        method: 'PUT',
        url: '/upload-first-video',
        handler: uploadsHandlers.handleFirstVideoUpload
    },
    {
        method: 'PUT',
        url: '/upload-second-video',
        handler: uploadsHandlers.handleSecondVideoUpload
    },
    {   
        method: 'POST',
        url: '/create-listing',
        handler: uploadsHandlers.createListingHandler
    },
    {
        method: 'POST',
        url: '/update-listing',
        handler: uploadsHandlers.updateListing
    },
    {
        method: 'GET',
        url:'/get-listing/:listing_id',
        handler: uploadsHandlers.getListing
    },
    {
        method: 'POST',
        url: '/post-listing-images',
        handler: uploadsHandlers.postListingImagesHandler
    },
    {
        method: "PUT",
        url:"/edit-listing",
        handler: uploadsHandlers.updateListing
    },
    {
        method: "GET",
        url: "/get-all-listings",
        handler: uploadsHandlers.getAllListings
    },
    {
        method: "GET",
        url: "/get-insta-post-insights",
        handler: getMediaIdFromUrl
    },
    {
        method: "GET",
        url: "/get-all-insta-posts",
        handler: uploadsHandlers.getAllInstagramPosts
    },
    {
        method: "POST",
        url: "/update-automatic-views",
        handler: uploadsHandlers.updateAutoSocialEntities
    },
    {
        method: "GET",
        url: "/get-all-facebook-posts",
        handler: uploadsHandlers.getFbPagePosts
    },
    {
        method: "PUT",
        url: "/upload-brochure-images",
        handler: uploadsHandlers.updateBrochureImages
    },
    {
        method: "PUT",
        url: "/upload-brochure-video",
        handler: uploadsHandlers.handleUploadBrochureVideo
    }
    // {
    //     method: "PUT",
    //     url: "/edit-listing/:listing_id",
    //     handler: uploadsHandlers
    // }
];

module.exports = {routes};
