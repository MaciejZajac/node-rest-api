const express = require("express");
const bodyParser = require("body-parser");

const feedRouter = require("./routes/feed");

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use("/feed", feedRouter);

app.listen(8080);
