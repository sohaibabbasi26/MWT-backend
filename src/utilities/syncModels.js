const { sequelize } = require('../../configurations/sequelizePgSQL')

sequelize.options.logging = console.log;

async function syncModels() {
    try {
        await sequelize.sync({ alter: true, force: true });
        console.log("All models were synchronized successfully.");

        sequelize.authenticate()
            .then(() => console.log('Database connection has been established successfully.'))
            .catch(err => console.error('Unable to connect to the database:', err));

    } catch (error) {
        console.error('Error syncing models:', error);
    }
}

module.exports = {
    syncModels
}