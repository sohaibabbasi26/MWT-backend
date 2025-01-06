const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configurations/sequelizePgSQL');

const Listing = sequelize.define('listings', {
    listing_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    location: {
        type: DataTypes.STRING,
    },
    visitors: {
        type: DataTypes.INTEGER,
    },
    listing_engagements: {
        type: DataTypes.INTEGER
    },
    interested_buyers: {
        type: DataTypes.INTEGER
    },
    saves: {
        type: DataTypes.INTEGER
    },
    features: {
        type: DataTypes.JSONB
    },
    socialCampaignsLinks: {
        type: DataTypes.JSONB
    },
    contact_form_header: {
        type: DataTypes.STRING
    },
    reviews: {
        type: DataTypes.JSONB
    },
    uploaded_video_one: {
        type: DataTypes.STRING
    },
    uploaded_video_two: {
        type: DataTypes.STRING
    },
    yt_link: {
        type: DataTypes.STRING
    }
})

module.exports = Listing;
