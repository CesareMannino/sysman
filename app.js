const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mysql = require('mysql');



// Parsing middleware
const app = express();
//Listen on port 5000

app.use(express.json()); //To parse the incoming requests with JSON payloads
app.use(express.urlencoded({extended: true})); //New


require("dotenv").config();


//make the home page as first page/landing page is connected to routes
const routes = require('./server/routes/user');
app.get('/', (req, res) => {
    res.render('home', {layout: 'main2'}) 
})


//get straight the page with app.get to render register
app.get('/register', (req, res) => {
    res.render('register', {layout: 'main2'}) 
})




app.use("/",routes);




//to load static file
app.use(express.static("public"));

//Templating engine to change the extenion of file from .handlebar to .hbs
app.engine("hbs", exphbs({extname:".hbs"}));
app.set("view engine","hbs");




const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));