const mysql = require('mysql');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'nodejs-login'
});

exports.register = (req, res) => {
    console.log(req.body);

    // is replaced by Destructor
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    // Destructor
    const { name, email, password, passwordConfirm } = req.body
    //query that order to MySQL to get the user email only once
    connection.query('SELECT email FROM login WHERE email = ?', [email], (error, results) => {
        if (error, results) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password != passwordConfirm) {
            return res.render('register', {
                message: 'Password do not match'
            });
        }
    });
    res.send('Form submitted')
};