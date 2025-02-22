const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configurations/sequelizePgSQL');

const InstantAccess = sequelize.define('instantAccess', {
    access_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = InstantAccess;
