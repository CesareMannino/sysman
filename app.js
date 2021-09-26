const express = require("express");
const path = require('path');
const mysql = require('mysql');
const exphbs = require("express-handlebars");

// to be removed when depoyed in heroku

require("dotenv").config();
const cookieParser = require('cookie-parser');

// Parsing middleware
const app = express();

//to load static file
app.use(express.static("public"));

//Listen on port 5000
app.use(express.urlencoded({extended: false})); //To parse URL-encoded bodies (as sent by HTML forms)
//Templating engine to change the extenion of file from .handlebar to .hbs
app.use(express.json()); //To parse the incoming requests with JSON bodies
app.use(cookieParser());

app.engine("hbs", exphbs({extname:".hbs"}));
app.set("view engine","hbs");


//link that tell to the server express.js to get the routeing from user.js
// const routes = require('./server/routes/user');
app.use("/",require('./routes/user'));
app.use('/auth', require('./routes/auth'));




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));