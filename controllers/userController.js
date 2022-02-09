const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const upload = require("../middleware/upload");




var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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

// connection.connect( (error) => {
//     if(error){
//         console.log(error);
//     }else{
//         console.log('MySQL user Connected...')
//     }
// });





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
exports.create = async (req, res, next) => {

    if (req.cookies.jwt) {
        try {
            //1)verify the token
            var decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );



            //2) Check if the user still exists
            connection.query('SELECT * FROM login WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result);

                if (!result) {
                    return next();
                }

            });
        } catch (error) {
            console.log(error);
            return next();
        }
    }




    const { first_name, last_name, email, phone, coc, expiration, covid_19, fitness, yellowF, PSSR, SURV, FFB, ADV, elementary, MAMS, FRC, medical_first, medical_care, GMDSS, RADAR, ARPA, arpa_btw, ecdis_gen, SSO, leadership_managerial, high_voltage, leader_teamwork_engine, leader_teamwork_deck, security_awa, security_duties, basic_saf_fam, security_related_fam, ecdis_specific } = req.body;
    // let searchTerm = req.body.search;



    //User the connection
    connection.query('INSERT INTO user SET ?', { user_id: decoded.id, first_name: first_name, last_name: last_name, email: email, phone: phone, coc: coc, expiration: expiration, covid_19: covid_19, fitness: fitness, yellowF: yellowF, PSSR: PSSR, SURV: SURV, FFB: FFB, ADV: ADV, elementary: elementary, MAMS: MAMS, FRC: FRC, medical_first: medical_first, medical_care: medical_care, GMDSS: GMDSS, RADAR: RADAR, ARPA: ARPA, arpa_btw: arpa_btw, ecdis_gen: ecdis_gen, SSO: SSO, leadership_managerial: leadership_managerial, high_voltage: high_voltage, leader_teamwork_engine: leader_teamwork_engine, leader_teamwork_deck: leader_teamwork_deck, security_awa: security_awa, security_duties: security_duties, basic_saf_fam: basic_saf_fam, security_related_fam: security_related_fam, ecdis_specific: ecdis_specific }, (err, rows) => {
        if (!err) {
            res.render('add-crew', { alert: 'Crew member added succesfully!' });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);

    });



};


// View all crew member for ui page
exports.view = (req, res) => {

    //Fetch the view data from database where the user_id is passed
    // as variable [decoded.id] so it will fetch only data for that particualr user_id on user table 
    connection.query('SELECT * FROM user WHERE user_id=?', [decoded.id], (err, rows) => {
        //when done with the connection, release it
        if (!err) {
            let removedUser = req.query.removed;
            res.render('ui', { rows, removedUser });
        } else {
            console.log(err);
        }
        // console.log('The data from user table:\n', rows);
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
        // console.log('The data from uer table:\n', rows);
    });
}



// Update crew
exports.update = async (req, res) => {

    try {
        await upload(req, res);
        // to extract the name of the field from the crew-forms.hbs
        // for (const [key, value] of Object.entries(req.files)) {
        //     // console.log(`${key}`);
        //     var extract = `${key}`

        // }

        // var nametag = extract;
        // console.log(nametag)

        
        var trova = JSON.parse(JSON.stringify(req.files));

        if (trova.hasOwnProperty('covid_19D') == false){
var covid_19D = 'no file uploaded'

        }else{
            var covid_19D = trova.covid_19D[0].filename
        }

        if (trova.hasOwnProperty('fitnessD') == false){
            var fitnessD = 'no file uploaded'
        
        }else{
            var fitnessD = trova.fitnessD[0].filename
        }


    //  function append(array, toAppend) {
    //     const arrayCopy = array.slice();
    //     if ('first' in toAppend) {
    //       arrayCopy.unshift(toAppend.first);
    //     }
    //     if ('last' in toAppend) {
    //       arrayCopy.push(toAppend.last);
    //     }
    //     return arrayCopy;
    //   }

//   console.log(trova)
    //   var access = append([trova.covid_19D[0].filename],{first:"test",last:"scan"})

     
 
        // var covid_19D = trova.covid_19D[0].filename
        // var fitnessD = trova.fitnessD[0].filename
        
        console.log(covid_19D)
        console.log(fitnessD)
        // console.log(trova.covid_19D[0].hasOwnProperty('filename'))
// const covid_19D = {}
//         const prop = 'prop' in covid_19D ? covid_19D.prop : 'default';
        
      



        var post = req.body;
        var covid_19 = post.covid_19;
        var fitness = post.fitness;
       

  


        connection.query('UPDATE user SET covid_19=?,fitness=?, covid_19D=?,fitnessD=?  WHERE id = ?', [covid_19, fitness, covid_19D, fitnessD, req.params.id])

        // var trova = req.files[nametag];
        // console.log("the printout is:",trova)




        // var covid_19D = trova.name;


        // var fitnessD = object.name;



        if (req.files.length <= 0) {
            return res.send(`You must select at least 1 file.`);
        }

        return res.send(`Files has been uploaded.`);
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE" || "Cannot read property '0' of undefined") {

            return res.send("Too many files to upload.");
        }
        // return res.send(`Error when trying upload many files: ${error}`);
    }
}


//         if (req.method == 'POST') {
//             var post = req.body;
//             var first_name = post.first_name;
//             var last_name = post.last_name;
//             var email = post.email;
//             var phone = post.phone;
//             var coc = post.coc;
//             var expiration = post.expiration;
//             var covid_19 = post.covid_19;
//             var fitness = post.fitness;
//             var yellowF = post.yellowF;
//             var PSSR = post.PSSR;
//             var SURV = post.SURV;
//             var FFB = post.FFB;
//             var ADV = post.ADV;
//             var elementary = post.elementary;
//             var MAMS = post.MAMS;
//             var FRC = post.FRC;
//             var medical_first = post.medical_first;
//             var medical_care = post.medical_care;
//             var GMDSS = post.GMDSS;
//             var RADAR = post.RADAR;
//             var ARPA = post.ARPA;
//             var arpa_btw = post.arpa_btw;
//             var ecdis_gen = post.ecdis_gen;
//             var SSO = post.SSO;
//             var leadership_managerial = post.leadership_managerial;
//             var high_voltage = post.high_voltage;
//             var leader_teamwork_engine = post.leader_teamwork_engine;
//             var leader_teamwork_deck = post.leader_teamwork_deck;
//             var security_awa = post.security_awa;
//             var security_duties = post.security_duties;
//             var basic_saf_fam = post.basic_saf_fam;
//             var security_related_fam = post.security_related_fam;
//             var ecdis_specific = post.ecdis_specific;




//             connection.query('UPDATE user SET first_name=? ,last_name=?, email=?, phone=?, coc=?, expiration=?,covid_19=?,covid_19D=?,fitness=?,yellowF=?, PSSR=?, SURV=?, FFB=?, ADV=?, elementary=?, MAMS=?, FRC=?, medical_first=?, medical_care=?, GMDSS=?,RADAR=?, ARPA=?, arpa_btw=?, ecdis_gen=?, SSO=?, leadership_managerial=?, high_voltage=?,leader_teamwork_engine=?, leader_teamwork_deck=?, security_awa=?, security_duties=?, basic_saf_fam=?,security_related_fam=?, ecdis_specific=? WHERE id = ?', [first_name, last_name, email, phone, coc, expiration, covid_19, covid_19D, fitness, yellowF, PSSR, , SURV, FFB, ADV, elementary, MAMS, FRC, medical_first, medical_care, GMDSS, RADAR, ARPA, arpa_btw, ecdis_gen, SSO, leadership_managerial, high_voltage, leader_teamwork_engine, leader_teamwork_deck, security_awa, security_duties, basic_saf_fam, security_related_fam, ecdis_specific, req.params.id], (err, rows) => {

//                 if (!err) {
//                     connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//                         if (!err) {
//                             res.render('edit-crew', { rows, alert: `${first_name} has been updated.` });

//                         } else {
//                             console.log(err);
//                         }
//                         // console.log('The data from user table:\n', rows);
//                     });
//                 } else {
//                     console.log(err);
//                 }
//                 // console.log('The data from user table:\n', rows);
//             });
//         }
//     }
// }




//delete crew
exports.delete = (req, res) => {
    // User the connection
    connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

        if (!err) {
            res.redirect('/ui');
        } else {
            console.log(err);
        }
        // console.log('The data from user table: \n', rows);

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




//to view the single crew member based on his id
exports.viewall = (req, res) => {

    connection.query('SELECT * FROM user WHERE id=?', [req.params.id], (err, rows) => {
        //when done with the connection, release it
        if (!err) {
            res.render('view-crew', { rows });

        } else {
            console.log(err);

        }
        // console.log('The data from user table:\n', rows);
    });
}





// fetch the file from user table and 
exports.readfile = (req, res, next) => {
    connection.query('SELECT * FROM user WHERE id=?', [req.params.id], (err, rows) => {
        if (!err) {
            res.render('index', { rows, layout: 'main3' });
            if (!err) {

            };
        } else {
            console.log(err);
        }
        // console.log('The data from user table:\n', rows);
    });
}








