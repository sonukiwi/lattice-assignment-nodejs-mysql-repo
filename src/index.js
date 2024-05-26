const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { hospitalRouter } = require("./routers/hospitalRouter");
dotenv.config();

const SERVER__PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/v1/hospital", hospitalRouter);

app.listen(SERVER__PORT, () =>
  console.log(`Server running on port ${SERVER__PORT}`)
);
