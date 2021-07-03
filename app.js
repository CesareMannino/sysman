const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mysql = require('mysql');



// Parsing middleware
const app = express();
//Listen on port 5000

app.use(express.json()); //To parse the incoming requests with JSON bodies
app.use(express.urlencoded({extended: true})); //To parse URL-encoded bodies (as sent by HTML forms)


require("dotenv").config();



//link that tell to the server express.js to get the routeing from user.js
const routes = require('./server/routes/user');
app.use("/",routes);
app.use('/auth', require('./server/routes/auth'));



//to load static file
app.use(express.static("public"));

//Templating engine to change the extenion of file from .handlebar to .hbs
app.engine("hbs", exphbs({extname:".hbs"}));
app.set("view engine","hbs");




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));