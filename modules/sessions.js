const authClient = require('../modules/oauth-client');
const botClient = require("./discord-client");

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
            authGuilds: getUserManageableGuilds(authGuilds)
        });
}

async function getBotManageableGuilds(guilds) {
    const filteredGuilds = Array.from(guilds.values()).filter(g => g.isOwner || g.permissions.includes('MANAGE_GUILD'));
    const existingGuilds = await botClient.getGuilds();
    
    const fetchedGuilds = [];
    filteredGuilds.forEach(guild => {
        var fetchedGuild = existingGuilds.get(guild.id);

        if (fetchedGuild) fetchedGuilds.push(fetchedGuild);
    })

    return fetchedGuilds;
}

function getUserManageableGuilds(guilds) {
    guilds = Array.from(guilds.values()).filter(g => g.isOwner || g.permissions.includes('MANAGE_GUILD'))

    return guilds;
}

module.exports = {
    get: get,
    update: update
}