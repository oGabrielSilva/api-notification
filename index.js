require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3030;
const router = require("./src/routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => console.log("Server listen on port", port));

module.exports = app;
