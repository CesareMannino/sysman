const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

var db_config = {
    host: "us-cdbr-east-04.cleardb.com",
    user: "bbaaff48f634c6",
    password: "dacbf7fa",
    database: "heroku_c7ad469172e97f3"
};

var connection;



function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();





// code in case the user leave the login space empty

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        connection.query('SELECT * FROM login WHERE email=?', [email], async (error, results) => {
            // console.log(results);
            // conditional statement to handle the wrong username error
            if (error === null) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            }
            //conditional if statement to compare password in database and password inserted by the client
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                }) //conditional statement to fetch the id of the client and signign in with sign() function
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                // console.log('the token is:' + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 // 24 hours converted in milliseconds to set the expiration cookies to 24 hours
                    ),
                    httpOnly: true
                }//setting of cookies on the browser and redirecting to the user interface page
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/ui');
            }

        });

    } catch (error) {
        console.log("this is the error:", error)
    }

}





// // home page
// exports.view = (req, res) => {
// res.render('home');
// }


exports.register = (req, res) => {
    // console.log(req.body);

    // is replaced by Destructor
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    // Destructor
    const { name, email, password, passwordConfirm } = req.body;
    //query that order to MySQL to get the user email only once
    connection.query('SELECT email FROM login WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        // console.log(hashedPassword);

        connection.query('INSERT INTO login SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                // console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });

            }
        })

    });

}


exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            //1)verify the token
            decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );



            //2) Check if the user still exists
            connection.query('SELECT * FROM login WHERE id = ?', [decoded.id], (error, result) => {
                // console.log(result);

                if (!result) {
                    return next();
                }
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).redirect('/');
}
