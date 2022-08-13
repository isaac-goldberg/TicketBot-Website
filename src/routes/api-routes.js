const express = require('express');
const authClient = require("../../modules/oauth-client");
const sessions = require("../../modules/sessions");
const dev = require("../../dev.json");
const { DISCORD_CLIENT_ID } = require("../../globals.json");

const router = express.Router();

const routerBaseURL = "/api";
const discordRedirectBaseURL = dev ? dev.DASHBOARD.URL : process.env.DASHBOARD_URL;

router.get("/invite", (req, res) => res.redirect(`${routerBaseURL}/invite`));
router.get(`${routerBaseURL}/invite`, (req, res) => {
    const redirectURI = encodeURIComponent(`${discordRedirectBaseURL}/api/auth-guild`);

    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectURI}&permissions=2013654263&scope=bot`);
});

router.get("/login", (req, res) => res.redirect(`${routerBaseURL}/login`));
router.get(`${routerBaseURL}/login`, (req, res) => {
    const redirectURI = encodeURIComponent(`${discordRedirectBaseURL}/api/auth`);

    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=identify guilds&prompt=none`);
});

router.get(`${routerBaseURL}/auth-guild`, async (req, res) => {
    try {
        const key = res.cookies.get('key');
        await sessions.update(key);
    } finally {
        res.redirect('/dashboard');
    }
    res.redirect('back');
});

router.get(`${routerBaseURL}/auth`, async (req, res) => {
    try {
        const code = req.query.code;
        const key = await authClient.queueGetAccess(code);

        res.cookies.set('key', key);
        
        setTimeout(() => res.redirect("/dashboard"), 250);
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
});

router.get("/logout", (req, res) => res.redirect(`${routerBaseURL}/logout`));
router.get(`${routerBaseURL}/logout`, (req, res) => {
    res.cookies.set('key', '');

    res.redirect('/');
});

module.exports = router;