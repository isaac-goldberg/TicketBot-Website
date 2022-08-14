const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => res.redirect("/"));
router.get("/", async (req, res) => {
    res.render("pages/home", { subtitle: "Home" });
});

module.exports = router;