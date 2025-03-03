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
    },
    {
        method: "POST",
        url: "/subscribe",
        handler: uploadsHandlers.createSubscriptionHandler
    },
    {
        method: "GET",
        url: "/fetch-all-subscribers",
        handler: uploadsHandlers.fetchAllSubscribersHandler
    },
    {
        method: "POST",
        url: "/subscribe-to-instant-access",
        handler: uploadsHandlers.createInstantAccessSubscriptionHandler
    },
    {
        method: "GET",
        url: "/fetch-instant-access-subscribers",
        handler: uploadsHandlers.fetchAllInsantAccessSubscribersHandler
    },
    {
        method: "DELETE",
        url: "/delete-listings",
        handler: uploadsHandlers.deleteListingsHandler
    },
    {
        method: "DELETE",
        url: "/delete-subscriptions",
        handler: uploadsHandlers.deleteSubscriptionsHandler
    },
    {
        method: "DELETE",
        url: "/delete-instant-subscribers",
        handler: uploadsHandlers.deleteInstantSubscriptionsHandler
    },
];

module.exports = {routes};
