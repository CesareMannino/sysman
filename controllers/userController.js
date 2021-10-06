const mysql = require('mysql');

// let connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
//   });
  

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

connection.connect( (error) => {
    if(error){
        console.log(error);
    }else{
        console.log('MySQL user Connected...')
    }
});


handleDisconnect();


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
    const { first_name, last_name, email, phone, coc, expiration, PSSR, SURV, FFB, ADV, elementary,MAMS,FRC,medical_first,medical_care,GMDSS,RADAR,ARPA,arpa_btw,ecdis_gen,SSO,leadership_managerial,high_voltage,leader_teamwork_engine,leader_teamwork_deck,security_awa,security_duties,basic_saf_fam,security_related_fam,ecdis_specific } = req.body;
    // let searchTerm = req.body.search;

    //User the connection
    connection.query('INSERT INTO user SET first_name = ?,last_name = ?,email = ?,phone = ?,coc=?,expiration=?,PSSR=?,SURV=?,FFB=?,ADV=?,elementary=?,MAMS=?,FRC=?,medical_first=?,medical_care=?,GMDSS=?,RADAR=?,ARPA=?,arpa_btw=?,ecdis_gen=?,SSO=?,leadership_managerial=?,high_voltage=?,leader_teamwork_engine=?,leader_teamwork_deck=?,security_awa=?,security_duties=?,basic_saf_fam=?,security_related_fam=?,ecdis_specific=?', [first_name, last_name, email, phone, coc, expiration, PSSR,SURV,FFB, ADV,elementary,MAMS,FRC,medical_first,medical_care,GMDSS,RADAR,ARPA,arpa_btw,ecdis_gen,SSO,leadership_managerial,high_voltage,leader_teamwork_engine,leader_teamwork_deck,security_awa,security_duties,basic_saf_fam,security_related_fam,ecdis_specific], (err, rows) => {
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
    const { first_name, last_name, email, phone, coc, expiration, PSSR, SURV, FFB, ADV,elementary,MAMS,FRC,medical_first,medical_care,GMDSS,RADAR,ARPA,arpa_btw,ecdis_gen,SSO ,leadership_managerial,high_voltage,leader_teamwork_engine,leader_teamwork_deck,security_awa,security_duties,basic_saf_fam,security_related_fam,ecdis_specific} = req.body;

    connection.query('UPDATE user SET first_name=? ,last_name=?, email=?, phone=?, coc=?, expiration=?, PSSR=?,SURV=?, FFB=?, ADV=?, elementary=?,MAMS=?,FRC=?,medical_first=?,medical_care=?,GMDSS=?,RADAR=?,ARPA=?,arpa_btw=?,ecdis_gen=?,SSO=?,leadership_managerial=?,high_voltage=?,leader_teamwork_engine=?,leader_teamwork_deck=?,security_awa=?,security_duties=?,basic_saf_fam=?,security_related_fam=?,ecdis_specific=? WHERE id = ?', [first_name, last_name, email, phone, coc, expiration, PSSR, SURV, FFB, ADV,elementary,MAMS,FRC,medical_first,medical_care,GMDSS,RADAR,ARPA,arpa_btw,ecdis_gen,SSO,leadership_managerial,high_voltage,leader_teamwork_engine,leader_teamwork_deck,security_awa,security_duties,basic_saf_fam,security_related_fam,ecdis_specific, req.params.id], (err, rows) => {
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

    if(!err) {
      res.redirect('/ui');
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