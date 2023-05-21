const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const helpers = require("./views/helpers");

require("dotenv").config();

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.engine("hbs", exphbs({
     extname: ".hbs",
     defaultLayout: "layout",
     layoutsDir: __dirname + "/views/layouts/",
     partialsDir: __dirname + "/views/partials/",
     helpers: helpers
}));

app.set("view engine", "hbs");
app.set('views', __dirname + '/views');

app.use("/", require('./routes/user'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
