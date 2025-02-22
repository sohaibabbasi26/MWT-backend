const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configurations/sequelizePgSQL');

const Subscriptions = sequelize.define('subscriptions', {
    subscription_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Subscriptions;
