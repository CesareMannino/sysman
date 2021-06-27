const mysql = require('mysql');

// home page
exports.view = (req, res) => {
res.render('home');
}