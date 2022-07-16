const app = require("express");
require("dotenv").config();
app.use(cors({ origin: process.env.ALLOW_DOMAINS }));
