const express = require("express");
const { discordClient } = require("../../modules/discord-client");
const { validateGuild } = require("../../modules/middleware");
const { DISCORD_CLIENT_PREFIX } = require("../../globals.json");

const router = express.Router();

router.get("/servers", (req, res) => res.redirect("/dashboard"));
router.get('/dashboard', (req, res) => {
    res.render('dashboard/index', {
        subtitle: 'Dashboard',
    });
});
router.get('/servers/:id', async (req, res) => res.redirect(`${req.originalUrl}/overview`));

router.get('/servers/:id/:module', validateGuild, async (req, res) => {
    const guild = res.locals.guild;

    if (!guild) {
        res.render('errors/404');
    } else {
        const owner = await discordClient.users.fetch(guild.ownerId);
        res.render('dashboard/show', {
            subtitle: guild.name,

            guild,
            owner,
            prefix: DISCORD_CLIENT_PREFIX,
        });
    }
});

module.exports = router;