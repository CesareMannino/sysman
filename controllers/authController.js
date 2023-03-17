const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();


var db_config = {
    host: "containers-us-west-195.railway.app",
    user: "root",
    password: "CoLsJ6ELIesOI7x5MuVv",
    database: "railway",
    port: 6393
};



// var db_config = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// };

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
//------- login page middleware-------

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
            if (results == "" || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });



                // console.log('the token is:' + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/ui');
            }

        });

    } catch (error) {
        console.log(error)
    }

}


exports.register = (req, res) => {
    // Destructor
    const { name, email, password, passwordConfirm, licencekey } = req.body;

    var url = "https://api.gumroad.com/v2/licenses/verify";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
           
            console.log(xhr.responseText);

        }


        


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


            connection.query('INSERT INTO login SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.render('register', {
                        message: 'User registered'
                    });

                }
            })

        });
        // console.log(xhr.status);
        if (xhr.status != 200) {
            return res.render('register', {
                message: 'License number not valid'
            })
        }
       
    }
   
    var data = "product_permalink=dpduj" + "&" + "license_key=" + `${licencekey}`
    xhr.send(data);

};




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
