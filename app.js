const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require('express-fileupload');
// const routes = require('./routes');
const http = require('http');
const path = require('path');
const busboy = require('then-busboy');
const mysql = require('mysql');
bodyParser=require("body-parser");
// const userContoller = require('./controllers/userController')
// to be removed when deployed in heroku

require("dotenv").config();
const cookieParser = require('cookie-parser');



// Parsing middleware
const app = express();

// default option
app.use(fileUpload());

//to load static file
app.use(express.static("public"));
app.use(express.static("upload"));
//Listen on port 5000
app.use(express.urlencoded({ extended: false })); //To parse URL-encoded bodies (as sent by HTML forms)

app.use(express.json()); //To parse the incoming requests with JSON bodies
app.use(cookieParser());

app.engine("hbs", exphbs({ extname: ".hbs" }));//Templating engine to change the extenion of file from .handlebar to .hbs
app.set("view engine", "hbs");




// var connection = mysql.createConnection({
// 	host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });
 
// connection.connect();
 
// global.db = connection;




//link which tell to the server express.js to get the routeing from user.js
// const routes = require('./server/routes/user');
app.use("/", require('./routes/user'));
app.use('/auth', require('./routes/auth'));


app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));