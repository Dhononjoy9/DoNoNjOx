module.exports.config = { 
    name: "self",
    version: "1.0.5",
    permssion: 0, 
    credits: "SK-SIDDIK-KHAN",
    description: "Manage bot admin",
    prefix: false,
    category: "config",
    usages: "[list/add/remove] [userID]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

const allowedUsers = ["100059026788061", "61574684206043"];
module.exports.languages = {
    "en": {
        "listAdmin": '➤ ADMIN LIST:\n🎓 | Owner: Sk Siddik\n•══════════════•\n%1',
        "notHavePermssion": '❗ You have no permission to use "%1"',
        "addedNewAdmin": '❗ | Added %1 new admin.\n%2',
        "removedAdmin": '📛 | Removed %1 Admin Siddik Bot.\n%2',
        "listId":'•═════•UID•═════•\n%1\n•═════•LIST•═════•'
    }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions, senderID } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    var time = require("moment-timezone").tz("Asia/Dhaka").format("HH:mm:ss D/MM/YYYY");

    if (event.messageReply) {
        const repliedMessage = event.messageReply.body.toLowerCase();

        if (repliedMessage.includes("self add")) {
            const idToAdd = event.messageReply.senderID || content[0];

            if (!allowedUsers.includes(senderID)) {
                return api.sendMessage("❗ You don't have permission to add admins.", threadID, messageID);
            }

            if (mention.length != 0) {
                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    const name = await Users.getNameUser(id);
                    return api.sendMessage(`✅ | Added ${name} as an admin.`, threadID, messageID);
                }
            }
            else if (idToAdd) {
                ADMINBOT.push(idToAdd);
                config.ADMINBOT.push(idToAdd);
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                const name = await Users.getNameUser(idToAdd);
                return api.sendMessage(`✅ | Added ${name} as an admin.`, threadID, messageID);
            }
            return api.sendMessage("❗ Invalid input.", threadID, messageID);
        }

        if (repliedMessage.includes("self remove")) {
            const idToRemove = event.messageReply.senderID || content[0];

            if (!allowedUsers.includes(senderID)) {
                return api.sendMessage("❗ You don't have permission to remove admins.", threadID, messageID);
            }

            const index = config.ADMINBOT.findIndex(item => item === idToRemove);
            if (index !== -1) {
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                const name = await Users.getNameUser(idToRemove);
                return api.sendMessage(`📛 | Removed ${name} as an admin.`, threadID, messageID);
            } else {
                return api.sendMessage("❗ This user is not an admin.", threadID, messageID);
            }
        }
    }

    switch (args[0]) {
        case "add":
        case "+": {
            const senderID = event.senderID;
            if (!allowedUsers.includes(senderID)) return api.sendMessage("❗ Only Permission User Can Use This File", event.threadID);

            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`✅ | ${event.mentions[id]}\n🆔 | ${id}\n⏳ | ${time}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = await Users.getNameUser(content[0]);
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", 1, `✅ | ${name}\n🆔 | ${content[1]}\n⏳ | ${time}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }

        case "remove":
        case "rm":
        case "delete":
        case "-": {
            const senderID = event.senderID;
            if (!allowedUsers.includes(senderID)) return api.sendMessage("❗ Only admin can remove admin from self list", event.threadID);

            if (mention.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`✅ | ${event.mentions[id]}\n🆔 | ${id}\n⏳ | ${time}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = await Users.getNameUser(content[0]);
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `✅ | ${name}\n🆔 | ${content[0]}\n⏳ | ${time}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    };
}
