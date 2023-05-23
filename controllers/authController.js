const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
const crypto = require('crypto');


const { sendResetPasswordEmail } = require('./emailNotifications');





var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "nodejs-login"
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


exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    // generate reset token - this is a simple version, consider using a more secure method
    const resetToken = crypto.randomBytes(32).toString('hex');

    // hash the reset token to store in the database
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token expiration date
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    connection.query('SELECT * FROM login WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No user with that email found' });
        }

        const user = results[0];

        connection.query('UPDATE login SET resetToken = ?, passwordResetExpires = ? WHERE id = ?', [resetTokenHash, resetTokenExpires, user.id], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'An error occurred' });
            }

            // send reset password email
            await sendResetPasswordEmail(user, resetToken);

            res.status(200).json({ message: 'Password reset token sent', resetToken: resetToken });
        });
    });
};



exports.resetPassword = (req, res) => {
    const { email, password, passwordConfirm, resetToken } = req.body;

    console.log('Received request:', { email, password, passwordConfirm, resetToken });

    if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // check if token is valid and not expired
    const passwordResetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log('Password reset token hash:', passwordResetTokenHash);

    connection.query('SELECT * FROM login WHERE email = ? AND resetToken = ?', [email, passwordResetTokenHash], async (error, results) => {
        console.log('Database response:', { error, results });
        
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        const user = results[0];
        console.log('User:', user);

        if (user.passwordResetExpires < Date.now()) {
            return res.status(400).json({ message: 'Token expired' });
        }

        // update user password and clear reset token
        const hashedPassword = await bcrypt.hash(password, 8);

        connection.query('UPDATE login SET password = ?, resetToken = NULL, passwordResetExpires = NULL WHERE id = ?', [hashedPassword, user.id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'An error occurred' });
            }

            res.status(200).json({ message: 'Password reset successful' });
        });
    });
}
