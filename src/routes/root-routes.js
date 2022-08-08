const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/home");
});

router.get("/home", (req, res) => {
    res.redirect("/");
});

module.exports = router;