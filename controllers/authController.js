const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: 'nodejs-login'
// });

let connection = {
    host: "us-cdbr-east-04.cleardb.com",
    user: "b78b7bce7d4d40",
    password: "f883fc91",
    database: "heroku_d6ddb37c373930d"
};
 



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        connection.query('SELECT * FROM login WHERE email=?', [email], async (error, results) => {
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log('the token is:' + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/ui');
            }

        })

    } catch (error) {
        console.log(error)
    }

}


connection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('MySQL nodejs-login connected...')
    }
});


// // home page
// exports.view = (req, res) => {
// res.render('home');
// }


exports.register = (req, res) => {
    console.log(req.body);

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
        console.log(hashedPassword);

        connection.query('INSERT INTO login SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
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
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log(decoded);
            //2) Check if the user still exists
            connection.query('SELECT * FROM login WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result);

                if(!result){
                    return next();
                }
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        next();
    }


    
}