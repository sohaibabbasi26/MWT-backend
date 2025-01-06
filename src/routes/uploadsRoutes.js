const uploadsHandlers = require('../handlers/uploadsHandler');
// const authValidation = require('../pre-handlers/authValidation');

const routes = [
    {
        method: 'POST',
        url: '/upload-first-video',
        handler: uploadsHandlers.handleFirstVideoUpload
    },
    {
        method: 'POST',
        url: '/create-listing',
        handler: uploadsHandlers.createListingHandler
    }
    // {
    //     method:'POST',
    //     url:'/upload-second-video',
    //     handler: uploadsHandlers.signup,
    //     // preHandler: authValidation.validateRegister
    // },
    // {
    //     method:'POST',
    //     url:'/login',
    //     handler:uploadsHandlers.login,
    //     // preHandler:authValidation.validateLogin
    // },
];

module.exports = {routes};
