const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const feedRouter = require("./routes/feed");

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    // IMPORTANT
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRouter);

app.use((error, req, res, next) => {
    console.log("error", error);
    const status = error.statusCode | 500;
    const message = error.message;
    res.status(status).json({
        message: message
    });
});

mongoose
    .connect("mongodb+srv://maciej:132639@cluster0-m9slc.mongodb.net/messages?retryWrites=true&w=majority")
    .then(result => {
        console.log("sukces");
        app.listen(8080);
    })
    .catch(err => console.log(err));
