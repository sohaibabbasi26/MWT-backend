const { uploadVideo } = require("../utilities/cloudinaryHelper");
const Listing = require("../models/listing");
const { getInsights } = require("../utilities/getPostInsights");
const { where } = require("sequelize");

const uploadFirstVideoService = async (filePath, listing_id) => {
  try {
    console.log("[FILE PATH URL]:", filePath);
    const check = await Listing.findOne({
      where: {
        listing_id: listing_id
      }
    });
    console.log("[CHECK IF THE LISTING EXISTS]:", check);

    if (check !== null) {
      console.log("[FILE PATH URL]:", filePath);
      const result = await uploadVideo(filePath);
      console.log("[UPLOADING TO CLOUDINARY RESULTANT URL]:", result.url);



      const updatedListingResult = await Listing.update(
        {
          uploaded_video_one: result.url,
        },
        {
          where: {
            listing_id: listing_id,
          },
        }
      );

      console.log("[updated entity]:", updatedListingResult);
      return {
        status: result?.status,
        message: result?.message,
        result: updatedListingResult,
      };
    } else {
      return {
        status: 404,
        message: "Listing was not found",
        result: null,
      };
    }


  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Some interruption has occurred",
      result: null,
    };
  }
};

const uploadSecondVideoService = async (filePath, listing_id) => {
  try {
    const check = await Listing.findOne({
      where: {
        listing_id: listing_id
      }
    });

    if (check !== null) {
      const result = await uploadVideo(filePath);
      console.log("[UPLOADING TO CLOUDINARY RESULT]:", result);

      const updatedListingResult = await Listing.update(
        {
          uploaded_video_two: result.url,
        },
        {
          where: {
            listing_id: listing_id,
          },
        }
      );

      console.log("[updated entity]:", updatedListingResult);
      return {
        status: result?.status,
        message: result?.message,
        result: updatedListingResult,
      };
    } else {
      return {
        status: 404,
        message: "Listing was not found",
        result: null,
      };
    }


  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Some interruption has occurred",
      result: null,
    };
  }
};

const uploadBrochureVideoService = async (filePath, listing_id) => {
  try {
    const check = await Listing.findOne({
      where: {
        listing_id: listing_id
      }
    });

    if (check !== null) {

      const result = await uploadVideo(filePath);
      console.log("[UPLOADING TO CLOUDINARY RESULT]:", result);

      let existingBrochure = check?.brochure || {};
      const brochureData = {
        images: [...(existingBrochure.images || [])],
        imagesText: [...(existingBrochure.imagesText || [])],
        video: result?.url
      };

      const updatedListingResult = await Listing.update(
        {
          brochure: brochureData
        },
        {
          where: {
            listing_id: listing_id,
          },
        }
      );

      console.log("[updated entity]:", updatedListingResult);
      return {
        status: result?.status,
        message: result?.message,
        result: updatedListingResult,
      };
    } else {
      return {
        status: 404,
        message: "Listing was not found",
        result: null,
      };
    }


  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Some interruption has occurred",
      result: null,
    };
  }
};

const updateListingService = async (listing_id, data) => {
  try {
    const result = await Listing.update(data, {
      where: {
        listing_id: listing_id,
      },
    });
    console.log("[result]:", result);
    return {
      status: 200,
      message: "Successfully updated the listing service",
      result: result,
    };
  } catch (err) {
    console.log("[ERROR]:", err);
    return {
      status: 500,
      message: "Internal Sever Error",
      result: null,
    };
  }
};

const getListingService = async ({ listing_id }) => {
  try {
    const result = await Listing.findOne(
      {
        where: {
          listing_id: listing_id
        }
      }
    );
    console.log("[RESULT FOUND LISTING]:", result);
    if (result === null) {
      return {
        status: 404,
        message: "Listing Not Found",
        data: null
      }
    } else {
      return {
        status: 200,
        message: "Successfully fetched a listing",
        data: result
      }
    }
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    }
  }
}

const getAllListingsService = async () => {
  try {
    const result = await Listing.findAll();
    console.log("[RESULT FOUND LISTING]:", result);
    if (result.length === 0) {
      return {
        status: 404,
        message: "You don't have any listings yet",
        listings: null
      }
    } else {
      return {
        status: 200,
        message: "Successfully fetched a listing",
        listings: result
      }
    }
  } catch (err) {
    console.log("[ERR]:", err);
    return {
      status: 500,
      message: "Internal Server Error",
      listings: null
    }
  }
}

const getAllInstagramPostsService = async () => {
  try {
    let allPosts = [];
    let nextPageUrl = `https://graph.facebook.com/v18.0/${process.env.META_INSTA_BUSINESS_ID}/media?fields=id,caption,timestamp&access_token=${process.env.META_ACCESS_TOKEN}`;

    while (allPosts?.length < 200) {
      const response = await fetch(nextPageUrl, { method: "GET" });
      const data = await response.json();

      console.log("[DATA]:", data);

      if (data?.data?.length) {
        allPosts.push(...data.data);
      }

      nextPageUrl = data?.paging?.next || null;
    }

    console.log("[ALL POSTS]:", allPosts.length);
    return {
      status: 200,
      message: "Successfully fetched all Instagram posts",
      data: allPosts
    };
  } catch (err) {
    console.log("[ERROR WHILE FETCHING INSTAGRAM POSTS]:", err);
    return {
      status: 500,
      message: "Couldn't get the Instagram posts",
      data: null
    };
  }
}

const updateAutoSocialEntitiesService = async (mediaIds, facebookPosts, listing_id) => {
  try {

    console.log("[facebookPosts]")

    console.log("[MEDIA IDs]:", mediaIds);
    if (mediaIds?.length === 0) {
      return {
        status: 400,
        message: "Didn't get proper data to fetch insights for."
      }
    }

    const insightsResults = await Promise.all(mediaIds.map(async (mediaId) => {
      const insights = await getInsights(mediaId);
      return { mediaId, insights };
    }));

    let totalViews = 0;
    let totalEngagements = 0;
    let totalInterestedBuyers = 0;

    insightsResults.forEach(({ insights }) => {
      totalViews += insights.reach || 0;
      totalEngagements += (insights.likes || 0) + (insights.comments || 0) + (insights.saved || 0);
      totalInterestedBuyers += insights.comments || 0;
    });

    facebookPosts.forEach(({ insights, comments }) => {
      totalViews += insights?.post_impressions || 0;
      totalEngagements += (insights?.post_reactions_like_total || 0) +
        (insights?.post_clicks || 0) +
        (comments?.summary?.total_count || 0);
      totalInterestedBuyers += comments?.summary?.total_count || 0;
    });

    console.log("[Insights]:", insightsResults);

    console.log("[INSIGHTS PROCESSED]");
    console.log("Total Views:", totalViews);
    console.log("Total Engagements:", totalEngagements);
    console.log("Total Interested Buyers:", totalInterestedBuyers);


    const checkIfListingExists = await Listing.findByPk(listing_id);
    console.log("[LISTING]:", checkIfListingExists);

    const updatedListingResult = await Listing.update({
      listing_engagements: totalEngagements,
      interested_buyers: totalInterestedBuyers,
      views: checkIfListingExists.mlsViews + checkIfListingExists.zillowViews + checkIfListingExists.homesDotComViews + totalViews
    }, {
      where: {
        listing_id: listing_id
      }
    });

    const finalUpdatedResult = await Listing.findByPk(listing_id);
    console.log("[UPDATED LISTING]:", finalUpdatedResult);

    console.log("[UPDATED LISTING RESULT]:", updatedListingResult);

    return {
      status: 200,
      message: "Successfully fetched the insights",
      instaInsights: insightsResults,
      fbInsights: facebookPosts,
      totalViews,
      totalEngagements,
      totalInterestedBuyers,
      updatedListingEntry: updatedListingResult
    }
  } catch (err) {
    console.log("[ERROR]:", err);
    return {
      status: 500,
      message: "Couldn't update the automatic social entities"
    }
  }
}

const getPageAccessToken = async () => {
  try {
    const tokenResponse = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${process.env.META_USER_ACCESS_TOKEN}`, {
      method: "GET"
    });
    const data = await tokenResponse.json();
    return data;
  } catch (err) {
    console.log("[ERR WHILE GETTING PAGE ACCESS TOKEN]:", err);
    return;
  }
}


const fetchPostInsights = async (postId, PAGE_ACCESS_TOKEN) => {
  try {
    const metrics = ["post_impressions", "post_engaged_users", "post_reactions_like_total", "post_clicks"];
    let insights = {};

    for (const metric of metrics) {
      const response = await fetch(`https://graph.facebook.com/v21.0/${postId}/insights?metric=${metric}&access_token=${PAGE_ACCESS_TOKEN}`, {
        method: "GET"
      });
      const data = await response.json();

      if (data?.data?.length > 0) {
        insights[metric] = data.data[0].values[0].value || 0;
      }
    }

    return insights;
  } catch (err) {
    console.log(`[ERROR FETCHING INSIGHTS FOR POST ${postId}]:`, err);
    return {};
  }
};

const getFbPagePostsService = async () => {
  try {
    const result = await getPageAccessToken();
    const PAGE_ACCESS_TOKEN = result?.data[0]?.access_token;
    console.log("[PAGE ACCESS TOKEN GENERATED]:", PAGE_ACCESS_TOKEN);

    let allPosts = [];
    let nextPageUrl = `https://graph.facebook.com/v21.0/${process.env.META_PAGE_ID}/posts?fields=id,message,created_time,comments.summary(true).limit(0),shares&access_token=${PAGE_ACCESS_TOKEN}`;

    while (allPosts.length < 200) {
      const postsResponse = await fetch(nextPageUrl, { method: "GET" });
      const postsData = await postsResponse.json();

      if (!postsData?.data) break;

      const postsWithInsights = await Promise.all(
        postsData.data.map(async (post) => {
          const insights = await fetchPostInsights(post.id, PAGE_ACCESS_TOKEN);
          return { ...post, insights };
        })
      );

      allPosts.push(...postsWithInsights);

      nextPageUrl = postsData?.paging?.next || null;
      console.log(`[FETCHED ${allPosts.length} POSTS SO FAR]`);
    }

    return {
      status: 200,
      message: "Successfully fetched all posts with insights.",
      posts: allPosts
    };
  } catch (err) {
    console.log("[ERROR FETCHING FACEBOOK POSTS]:", err);
    return {
      status: 500,
      message: "Couldn't fetch Facebook posts.",
      posts: []
    };
  }
};

module.exports = {
  uploadFirstVideoService,
  updateListingService,
  getListingService,
  uploadSecondVideoService,
  getAllListingsService,
  getAllInstagramPostsService,
  updateAutoSocialEntitiesService,
  getFbPagePostsService,
  uploadBrochureVideoService
};
