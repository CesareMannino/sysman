const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
bodyParser = require("body-parser");



// aws.config.region = 'us-east-1';

// to be removed when deployed in heroku
require("dotenv").config();
const cookieParser = require('cookie-parser');

// Parsing middleware
const app = express();

//to load static file
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); //To parse URL-encoded bodies (as sent by HTML forms) set from false to true as per bezkoder tutorial

app.use(express.json()); //To parse the incoming requests with JSON bodies
app.use(cookieParser());

app.engine("hbs", exphbs({ extname: ".hbs" }));//Templating engine to change the extenion of file from .handlebar to .hbs
app.set("view engine", "hbs");

app.use("/", require('./routes/user'));
app.use('/auth', require('./routes/auth'));


app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

