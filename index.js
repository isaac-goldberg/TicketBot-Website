const express = require("express");
const mustacheExpress = require("mustache-express");
const { PORT } = require("./globals.json");

const app = express();

// app routers
const rootRoutes = require("./src/routes/root-routes");

// app settings
app.engine("html", mustacheExpress());
app.set("views", `${__dirname}/src/views`);
app.set("view engine", "html")

// app view directories
app.use(express.static(`${__dirname}/src/assets`));
app.locals.basedir = `${__dirname}/src/assets`;

// use routers
app.use("/", rootRoutes);

app.listen(PORT, () => {
    console.log(`Server online on port ${PORT}`);
});