const express = require("express");
const cookies = require("cookies");
const bodyParser = require("body-parser");
const { PORT } = require("./globals.json");

const app = express();

// app modules
const databaseClient = require("./modules/database-client");
const middleware = require("./modules/middleware");

// app routers
const rootRoutes = require("./src/routes/root-routes");
const authRoutes = require("./src/routes/auth-routes");
const dashboardRoutes = require("./src/routes/dashboard-routes");

// app settings
app.set("views", `${__dirname}/src/views`);
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookies.express('a', 'b', 'c'));

// app view directories
app.use(express.static(`${__dirname}/src/assets`));
app.locals.basedir = `${__dirname}/src/assets`;

// use routers
app.use("/",
    middleware.updateUser, rootRoutes,
    authRoutes,
    middleware.validateUser, middleware.updateGuilds, dashboardRoutes
);

// redirects 404 errors
app.all('*', (req, res) => res.render('errors/404'));

// waits to connect to the database
databaseClient.waitForReady().then(() => {
    // waits for the discord client to start before starting the server
    app.listen(PORT, () => {
        console.log(`Server online on port ${process.env.PORT || PORT}`);
    });
});

module.exports = app;