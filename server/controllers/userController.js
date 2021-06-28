const mysql = require('mysql');

mysql.createConnection(process.env.CLEARDB_DATABASE_URL)





// View Users
exports.view = (req, res) => {
    //User the connection
    connection.query('SELECT * FROM user WHERE status="active"', (err, rows) => {
        //when done with the connection, release it
        if (!err) {
            let removedUser = req.query.removed;
            res.render('ui', { rows, removedUser });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
};


//find user by Search
exports.find = (req, res) => {
    let searchTerm = req.body.search;
    //User the connection
    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        if (!err) {
            res.render('ui', { rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
};

exports.form = (req, res) => {
    res.render('add-crew');
}

//Add crew member
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, coc, expiration, PSSR, FFB, ADV } = req.body;
    // let searchTerm = req.body.search;

    //User the connection
    connection.query('INSERT INTO user SET first_name = ?,last_name = ?,email = ?,phone = ?,coc=?,expiration=?,PSSR=?,FFB=?,ADV=?', [first_name, last_name, email, phone, coc, expiration, PSSR, FFB, ADV], (err, rows) => {
        if (!err) {
            res.render('add-crew', { alert: 'Crew member added succesfully!' });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);

    });

};
// edit crew function
exports.edit = (req, res) => {
    //User the connection
    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
            res.render('edit-crew', { rows });
        } else {
            console.log(err);
        }
        console.log('The data from uer table:\n', rows);
    });
}
// Update crew
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, coc, expiration, PSSR, FFB, ADV } = req.body;

    connection.query('UPDATE user SET first_name=? ,last_name=?, email=?, phone=?, coc=?, expiration=?, PSSR=?, FFB=?, ADV=? WHERE id = ?', [first_name, last_name, email, phone, coc, expiration, PSSR, FFB, ADV, req.params.id], (err, rows) => {
        if (!err) {
            connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with the connection release it
                // connection.release();
                if (!err) {
                    res.render('edit-crew', { rows, alert: `${first_name} has been updated.` });
                } else {
                    console.log(err);
                }
                console.log('The data from user table:\n', rows);
            });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
}


//delete crew
exports.delete = (req, res) => {
    // User the connection
    connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
            let removedUser = encodeURIComponent();
            res.redirect('/ui?removed=' + removedUser);
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);

    });
}


// hide user
// connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//     } else {
//       console.log(err);
//     }
//     console.log('The data from beer table are: \n', rows);
//   });

// }


//view crew
exports.viewall = (req, res) => {
    //User the connection
    connection.query('SELECT * FROM user WHERE id=?', [req.params.id], (err, rows) => {
        //when done with the connection, release it
        if (!err) {
            res.render('view-crew', { rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
}

// home page
// exports.view = (req, res) => {
// res.render('home');
// }