const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => res.redirect("/"));
router.get("/", async (req, res) => {
    console.log("----------------------\nHELLO WORLD ROOT ROUTES\n----------------------------");

    res.render("pages/home", { subtitle: "Home" });
});

module.exports = router;