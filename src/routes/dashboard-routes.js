const express = require("express");
const { databaseClient } = require("../../modules/database-client");
const { validateGuild } = require("../../modules/middleware");
const { DISCORD_CLIENT_PREFIX } = require("../../globals.json");

const router = express.Router();

router.use((req, res, next) => {
    res.locals.utils = utils;
    next();
});

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
        res.render('dashboard/show', {
            subtitle: guild.name,

            guild,
            prefix: DISCORD_CLIENT_PREFIX,
        });
    }
});

module.exports = router;

// -------------------------------------
// FRONTEND TEMPLATING UTILITY FUNCTIONS
// -------------------------------------
const utils = {
    getNameAcronym: (name) => {
        return name
            .replace(/'s /g, ' ')
            .replace(/\w+/g, e => e[0])
            .replace(/\s/g, '');
    },

    getGuildIcon: (guildId, iconHash, size) => {
        return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=${size}`;
    }
}