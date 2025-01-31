
const fetchIndividualInsight = async (metric, mediaId) => {
    try {
        const result = await fetch(`https://graph.facebook.com/v19.0/${mediaId}/insights?metric=${metric}&access_token=${process.env.META_ACCESS_TOKEN}`);
        const data = await result.json();
        console.log("[fetched data]:",data);
        const destructuredValue = data?.data[0]?.values[0]?.value;
        return destructuredValue;
    } catch (err) {
        console.log("[ERR]:",err);
        return;
    }
}

const getInsights = async (mediaId) => {
    try {
        const metrics = ["reach", "saved", "likes", "comments"];
        const insightsValues = await Promise.all(metrics.map((metric) => fetchIndividualInsight(metric, mediaId)));

        const insightsObject = metrics.reduce((acc, metric, index) => {
            acc[metric] = insightsValues[index];
            return acc;
        }, {});

        return insightsObject;
       
    } catch (err) {
        console.log("[ERROR WHILE QUERYING ABOUT THE MEDIA]:",err);
        return err;
    }
}

module.exports = {
    getInsights
}