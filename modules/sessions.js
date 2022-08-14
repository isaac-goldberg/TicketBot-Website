const authClient = require('../modules/oauth-client');
const { databaseClient } = require('./database-client');
const apiClient = require("./api-client");

const sessionMap = new Map();

async function get(key) {
    return sessionMap.get(key) || (await create(key));
}

async function create(key) {
    setTimeout(() => sessionMap.delete(key), 30_000);
    await update(key);

    return sessionMap.get(key);
}

async function update(key) {
    let authGuilds = await authClient.queueGetGuilds(key);
    let authUser = await authClient.queueGetUser(key);
    return sessionMap
        .set(key, {
            authUser,
            guilds: await getBotManageableGuilds(authGuilds),
        });
}

async function getBotManageableGuilds(guilds) {
    const filteredGuilds = Array.from(guilds.values()).filter(g => g.isOwner || g.permissions.includes('MANAGE_GUILD'));
    const existingGuilds = await databaseClient.getMany("guilds");

    const promiseArr = [];
    filteredGuilds.forEach(async (guild) => {
        var existingGuild = existingGuilds.find(g => guild.id === g.guildId);
        if (existingGuild) {
            promiseArr.push(new Promise(async (resolve, _reject) => {
                var fetchedGuild = await apiClient.getGuild(guild.id);
                resolve(fetchedGuild);
            }));
        }
    });

    const results = await Promise.all(promiseArr);
    return results;
}

module.exports = {
    get: get,
    update: update
}