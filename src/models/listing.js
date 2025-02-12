const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configurations/sequelizePgSQL');

const Listing = sequelize.define('listings', {
    listing_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT('medium'),
    },
    location: {
        type: DataTypes.STRING,
    },
    visitors: {
        type: DataTypes.INTEGER,
    },
    views: {
        type: DataTypes.INTEGER
    },
    zillowViews: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mlsViews: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    homesDotComViews: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    address: {
        type: DataTypes.STRING,
        allowNull: true
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
    },
    uploaded_images: {
        type: DataTypes.JSONB
    },
    brochure: {
        type: DataTypes.TEXT,
        defaultValue: null
    }
});

module.exports = Listing;
