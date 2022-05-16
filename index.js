require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3030;
const router = require("./src/routes");

app.use(router);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => console.log("Server listen on port", port));
