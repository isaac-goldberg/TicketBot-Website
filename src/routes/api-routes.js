const express = require("express");
const phin = require("phin");
const router = express.Router();

const botAPI = process.env.ENVIRONMENT === "prod" ? "https://tickbot2.herokuapp.com/api" : "http://localhost:3000/api";
const apiPassword = process.env.ENVIRONMENT === "prod" ? process.env.API_PASSWORD : require("../../dev.json").API.PASSWORD;
const baseURL = "/api";

router.post(`${baseURL}/commands/:commandName`, async (req, res) => {
    await phin({
        url: `${botAPI}/commands/${req.params.commandName}`,
        method: "POST",
        headers: {
            Authorization: apiPassword,
            "Content-Type": "application/json",
        },
        data: req.body,
        parse: "string",
    }).catch(console.error);

    res.sendStatus(200);
});

module.exports = router;