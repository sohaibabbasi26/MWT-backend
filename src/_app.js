const fastify = require('fastify')({
    logger: true
});
const cors = require("@fastify/cors");
// const { routes } = require('../src/routes/primaryRoutes');
const {  routes } = require('../src/routes/uploadsRoutes');
require('dotenv').config();
const { syncModels } = require("../src/utilities/syncModels");
const {generateJwtSecret} = require('../src/utilities/jwtSecretGenerator');
const { socketIOConnection } = require('../configurations/socketio');
const { connectRabbitMQ } = require('../configurations/rabbitMQgateway');
const Listing = require('../src/models/listing');

fastify.register(cors, { 
    origin: process.env.ALLOWED_CLIENT
});

fastify.register(require("@fastify/multipart"));

const serverInit = async () => {

    routes.forEach((route) => {
        fastify.route(route);
    });

    syncModels();

    fastify.listen({ port: process.env.SERVER_PORT, host: process.env.SERVER_HOST}, function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
    });
}

module.exports = {
    serverInit
}
