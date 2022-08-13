const { Client, GatewayIntentBits } = require("discord.js");
const dev = require("../dev.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
    ]
});

client.on("ready", () => {
    console.log(`${client.user.username} Discord client is online`);
});

client.login(dev ? dev.DISCORD.TOKEN : process.env.DISCORD_CLIENT_TOKEN);

module.exports.awaitDiscordClient = async function() {
    return new Promise((resolve, _reject) => {
        (function waitForReady() {
            if (client.isReady()) return resolve(true);
            setTimeout(waitForReady, 50);
        })();
    });
}
module.exports.discordClient = client;
module.exports.getGuilds = async () => {
    const guilds = client.guilds.cache;
    return guilds;
}