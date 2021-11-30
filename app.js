const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
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


//link which tell to the server express.js to get the routeing from user.js
// const routes = require('./server/routes/user');
app.use("/", require('./routes/user'));
app.use('/auth', require('./routes/auth'));

// Connection Pool
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nodejs-login'
  });
  
  


  
  // app.get('/', (req, res)=>{
  
  // res.send('<a href="/download">Download</a>');
  
  // });
  
  // app.get('/download', (req, res)=>{
  
  // res.download(path.join(__dirname, 'upload/Virgin.jpg'), (err)=>{
  
  //     console.log(err);
  
  // });
  // console.log('Your file has been downloaded!')
  // });
  
  

 
  // app.get('', (req, res) => {
  //   connection.query('SELECT * FROM user WHERE id = "179"', (err, rows) => {
  //     if (!err) {
  //       res.render('index', { rows });
  //     }
  //   });
  // });
  
  // app.post('/:id', (req, res) =>{
  //   const id = req.params.id.toString;
  //   const queryString = `UPDATE user SET profile_image = ? WHERE id=${id}`
    
  //   connection.query( queryString, 
  //   [sampleFile.name], (err, rows) => {
  //       if (!err) {
  //         res.redirect('/index');
  //       } else {
  //         console.log(err);
  //       }
  //     });
  //   });

  
  app.post('', (req, res) => {
  let sampleFile;
  let uploadPath;
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  // name of the input is sampleFile
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/upload/' + sampleFile.name;
  
  // console.log(sampleFile.name);
  
  // Use mv() to place file on the server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
  
      connection.query('UPDATE user SET profile_image = ? WHERE id="179"', [sampleFile.name], (err, rows) => {
        if (!err) {
          res.redirect('/index');
        } else {
          // console.log(err);
        }
      });
    });
  });

  

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));