const mysql = require('mysql');


let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'nodejs-login'
  });
  
  
connection.connect( (error) => {
    if(error){
        console.log(error);
    }else{
        console.log('MySQL nodejs-login connected...')
    }
});


// home page
exports.view = (req, res) => {
res.render('home');
}