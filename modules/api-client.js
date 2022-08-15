const dev = process.env.ENVIRONMENT === "prod" ? false : require("../dev.json");
const phin = require("phin");

class APIClient {
    /**
     * Creates a new Discord API client for the bot user.
     * 
     * @param {string} token The bot token.
     * @param {string} secret The bot secret.
     */
    constructor(token, secret) {
        this._baseUrl = "https://discord.com/api";
        this.token = token;
        this.secret = secret;
        this.token_type = "Bot"
    }

    /**
     * Sends an API request.
     * 
     * @param {string} url The url to make the request to. 
     * @returns {Promise<any>} The resource fetched.
     */
    async sendRequest(url) {
        const response = await phin({
            url,
            method: "GET",
            headers: { Authorization: `${this.token_type} ${this.token}` },
            parse: "json"
        }).catch(console.error);

        return response.body;
    }

    /**
     * Gets a guild.
     * 
     * @param {string} guildId The id of the guild to fetch.
     * @returns {Promise<any>} The fetched guild resource.
     */
    async getGuild(guildId) {
        return await (this.sendRequest(`${this._baseUrl}/guilds/${guildId}`));
    }
}

const client = new APIClient(dev ? dev.DISCORD.TOKEN : process.env.DISCORD_CLIENT_TOKEN, dev ? dev.DISCORD.SECRET : process.env.DISCORD_CLIENT_SECRET);

module.exports = client;