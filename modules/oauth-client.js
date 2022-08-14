const discoOauth = require('disco-oauth');
const { DISCORD_CLIENT_ID } = require("../globals.json");
const dev = require("../dev.json");

class OauthClient extends discoOauth {
    constructor (clientId, clientSecret) {
        super(clientId, clientSecret);

        this.requestQueued = false;
    }

    /**
     * Sets the client's next queued request timestamp
     * 
     * @param {boolean} [value] The value to set the request queue boolean to
     */
    setQueueRequest(value = true) {
        this.requestQueued = value;
    }

    /**
     * Handles the request to prevent ratelimiting
     * 
     * @param {string} authKey The authentication key or token to provide the callback function with
     * @param {string} callbackName The name of the function to get data from
     * @returns {Promise<any>}
     */
    async handleRequest(authKey, callbackName) {
        return new Promise((resolve, _reject) => {
            this[callbackName](authKey).then((data) => {
                resolve(data);
            }).catch(() => {
                setTimeout(async () => {
                    resolve(await this.handleRequest(authKey, callbackName));
                }, 100);
            });
        });
    }

    /**
     * Calculates the amount of time (in milliseconds) to wait before making the next request
     * 
     * @returns {Promise<void>}
     */
    async awaitQueueRequest () {
        if (this.requestQueued) {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    (function waitForQueueEmpty() {
                        if (!this.requestQueued) return resolve();
                        setTimeout(waitForQueueEmpty, 50);
                    })
                }, 200);
            });
        } else {
            this.setQueueRequest(true);
            return;
        }
    }

    /**
     * Adds a request to get a user access token using the provided code to the queue.
     * 
     * @param {string} code The authorization code provided by the Discord API
     * @returns {Promise<any>} The key that was exchanged from the Discord API for the code
     */
    async queueGetAccess(code) {
        await this.awaitQueueRequest();
        const key = await this.handleRequest(code, "getAccess");

        this.setQueueRequest(false);
        return key;
    }

    /**
     * Adds a request to get the user guilds using the provided key to the queue.
     * 
     * @param {string} key The key provided by the Discord API
     * @returns {Promise<any>}
     */
    async queueGetGuilds(key) {
        await this.awaitQueueRequest();
        const guilds = await this.handleRequest(key, "getGuilds");

        this.setQueueRequest(false);
        return guilds;
    }

    /**
     * Adds a request to get the user's info using the provided key to the queue.
     * 
     * @param {string} key The key provided by the Discord API
     * @returns {Promise<any>}
     */
    async queueGetUser(key) {
        await this.awaitQueueRequest();
        const user = await this.handleRequest(key, "getUser");

        this.setQueueRequest(false);
        return user;
    }
}

const client = new OauthClient(DISCORD_CLIENT_ID, dev ? dev.DISCORD.SECRET : process.env.DISCORD_CLIENT_SECRET);
client.setRedirect(`${dev ? dev.DASHBOARD.URL : process.env.DASHBOARD_URL}/api/auth`);
client.setScopes('identify', 'guilds', 'email');

console.log("----------------------\nHELLO WORLD OAUTH CLIENT\n----------------------------");

module.exports = client;