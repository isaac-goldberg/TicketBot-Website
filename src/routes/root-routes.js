const express = require("express");
const router = express.Router();
const { getGuilds } = require("../../modules/discord-client"); 


router.get("/home", (req, res) => res.redirect("/"));
router.get("/", async (req, res) => {
    const guildNames = [];
    const guilds = await getGuilds();
    guilds.forEach(g => {
        guildNames.push(g.name);
    });

    res.render("pages/home", { subtitle: "Home", guilds: guildNames });
});



module.exports = router;