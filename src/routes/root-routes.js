const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => res.redirect("/"));
router.get("/", async (req, res) => {
    res.render("pages/home", { subtitle: "Home" });
});

router.get("/tos", (req, res) => res.redirect("/terms"));
router.get("/terms", async (req, res) => {
    res.render("pages/tos", { subtitle: "Terms of Service" });
});

router.get("/privacy", async (req, res) => {
    res.render("pages/privacy", { subtitle: "Privacy Policy" });
});

module.exports = router;