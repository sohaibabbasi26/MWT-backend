// require('dotenv').config();

function shortcodeToInstaID(Shortcode) {
    var char;
    var id = 0;
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    for (var i = 0; i < Shortcode.length; i++) {
        char = Shortcode[i];
        id = (id * 64) + alphabet.indexOf(char);
    }
    return id;
}

export const getShortcodeFromUrl = (postUrl) => {
    try {
        const regex = /instagram\.com\/(p|reel|tv)\/([^/?#&]+)/;
        const match = postUrl.match(regex);

        console.log("[MATCH]:",match);



        if (!match || !match[2]) {
            throw new Error("Invalid Instagram post URL.");
        }

        return match[2];
    } catch (err) {
        console.error("[ERROR EXTRACTING SHORTCODE]:", err.message);
        return null;
    }
};


export const getMediaIdFromUrl = async (url) => {

    try {
        const shortCode = getShortcodeFromUrl("https://www.instagram.com/p/DFDYCJ4ujAo");
        console.log("[SHORT CODE]:",shortCode)

        const id = shortcodeToInstaID(shortCode);

        console.log("[id out of short code]:",id);

        function shortcodeToInstaID(Shortcode) {
      var char;
      var id = 0;
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      for (var i = 0; i < Shortcode.length; i++) {
          char = Shortcode[i];
          id = (id * 64) + alphabet.indexOf(char);
      }
      return id;
  }
        // const response = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${url}&access_token=${process.env.META_ACCESS_TOKEN}`);
        const response = await fetch(`https://graph.facebook.com/v18.0/ig_shortcode/${shortCode}?fields=id&access_token=${process.env.META_ACCESS_TOKEN}`);
        const data = await response.json();
        console.log("[DETAILS]:",data);
        return data;
    } catch (err) {
        console.log("[ERROR WHILE INSTAGRAM POST DETAILS]:",err);
        return;
    }
}


export const getInstagramPostsInsights = async (mediaId, metric) => {
    try {
        const response = await fetch (`https://graph.facebook.com/v18.0/3549786632468705320/insights?metric=${metric}&access_token=${process.env.META_ACCESS_TOKEN}`,{
            method:"GET"
        });
        const data = await  response.json();
        console.log("[DATA FETCHED FROM INSTAGRAM INSIGHTS API]:",data);
        const value = data.data?.values[0]?.value;
        console.log(`\n[${metric}]: ${value}\n`);
        return value;
    } catch (err) {
        console.log("[INSTAGRAM INSIGHTS FETCHING ERROR]:",err);
        return;
    }
}

export const getInstaPageAllPosts = async () => {
    try {
        const response = await fetch (` https://graph.facebook.com/v18.0/${process.env.META_INSTA_BUSINESS_ID}/media?access_token=${process.env.META_ACCESS_TOKEN}`,{
            method:"GET"
        });
        const data = await  response.json();
        console.log("[DATA FETCHED FROM INSTAGRAM API]:",data);
        const value = data.data?.values[0]?.value;
        // console.log(`\n[${metric}]: ${value}\n`);
        return value;

    } catch (err) {
        console.log("[INSTAGRAM INSIGHTS FETCHING ERROR]:",err);
        return;
    }
}