const axios = require("axios");

module.exports.config = {
  name: "tiktok",
  version: "1.0.1",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "Send 1000 free TikTok views using LikesJet API",
  prefix: true,
  category: "tiktok",
  usages: "tiktok",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (args.length < 2) {
    return api.sendMessage(
      "❌ Please provide a username and TikTok video link.\nExample:\n  inbox @jp_siddik07 https://tiktok.com/@jp_siddik07/video/1234567890",
      threadID,
      messageID
    );
  }

  const user = args[0];
  const link = args[1];
  const email = `sksiddik${Math.floor(Math.random() * 100000)}@gmail.com`;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X)",
    "Origin": "https://likesjet.com",
    "Referer": "https://likesjet.com/"
  };

  const data = {
    tiktok_username: user,
    link: link,
    email: email
  };

  api.sendMessage(`⏳ Sending 1000 views to:\nUser: ${user}\nLink: ${link}`, threadID, messageID);

  try {
    const res = await axios.post("https://api.likesjet.com/freeboost/3", data, { headers });

    if (res.data.status) {
      api.sendMessage(`✅ Successfully sent 1000 views to the video!`, threadID, messageID);
    } else {
      api.sendMessage(`❌ Failed: ${res.data.message || "Unknown error occurred."}`, threadID, messageID);
    }

  } catch (error) {
    api.sendMessage(`❌ API Error: ${error.message}`, threadID, messageID);
  }
};
