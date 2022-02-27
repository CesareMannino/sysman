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
            res.render('ui', {layout: 'main2', rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
};

exports.form = (req, res) => {
    res.render('add-crew',{layout: 'main2'});
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


    try {
        await upload(req, res);
        // --FILE HANDLING BLOCKCODE---

        // console.log(req.files)

        var find = JSON.parse(JSON.stringify(req.files));//  to remove Object:null prototype
        // conditional statments to hanlde the front end file existence.
      
        if (find.hasOwnProperty('covid_19D') == false) {
            var covid_19D = req.body.covid_19D
        } else {
            var covid_19D = find.covid_19D[0].key

        }


        if (find.hasOwnProperty('fitnessD') == false) {
            var fitnessD = req.body.fitnessD
        } else {
            var fitnessD = find.fitnessD[0].key
        }

        if (find.hasOwnProperty('yellowFD') == false) {
            var yellowFD = req.body.yellowFD
        } else {
            var yellowFD = find.yellowFD[0].key
        }


        if (find.hasOwnProperty('basic_saf_famD') == false) {
            var basic_saf_famD = req.body.basic_saf_famD
        } else {
            var basic_saf_famD = find.basic_saf_famD[0].key
        }


        if (find.hasOwnProperty('security_related_famD') == false) {
            var security_related_famD = req.body.security_related_famD
        } else {
            var security_related_famD = find.security_related_famD[0].key
        }

        if (find.hasOwnProperty('PSSRD') == false) {
            var PSSRD = req.body.PSSRD
        } else {
            var PSSRD = find.PSSRD[0].key
        }

        if (find.hasOwnProperty('SURVD') == false) {
            var SURVD = req.body.SURVD
        } else {
            var SURVD = find.SURVD[0].key
        }

        if (find.hasOwnProperty('FFBD') == false) {
            var FFBD = req.body.FFBD
        } else {
            var FFBD = find.FFBD[0].key
        }

        if (find.hasOwnProperty('ADVD') == false) {
            var ADVD = req.body.ADVD
        } else {
            var ADVD = find.ADVD[0].key
        }


        if (find.hasOwnProperty('elementaryD') == false) {
            var elementaryD = req.body.elementaryD
        } else {
            var elementaryD = find.elementaryD[0].key
        }

        if (find.hasOwnProperty('MAMSD') == false) {
            var MAMSD = req.body.MAMSD
        } else {
            var MAMSD = find.MAMSD[0].key
        }

        if (find.hasOwnProperty('FRCD') == false) {
            var FRCD = req.body.FRCD
        } else {
            var FRCD = find.FRCD[0].key
        }

        if (find.hasOwnProperty('medical_firstD') == false) {
            var medical_firstD = req.body.medical_firstD
        } else {
            var medical_firstD = find.medical_firstD[0].key
        }

        if (find.hasOwnProperty('medical_careD') == false) {
            var medical_careD = req.body.medical_careD
        } else {
            var medical_careD = find.medical_careD[0].key
        }

        if (find.hasOwnProperty('GMDSSD') == false) {
            var GMDSSD = req.body.GMDSSD
        } else {
            var GMDSSD = find.GMDSSD[0].key
        }

        if (find.hasOwnProperty('RADARD') == false) {
            var RADARD = req.body.RADARD
        } else {
            var RADARD = find.RADARD[0].key
        }

        if (find.hasOwnProperty('ARPAD') == false) {
            var ARPAD = req.body.ARPAD
        } else {
            var ARPAD = find.ARPAD[0].key
        }

        if (find.hasOwnProperty('arpa_btwD') == false) {
            var arpa_btwD = req.body.arpa_btwD
        } else {
            var arpa_btwD = find.arpa_btwD[0].key
        }

        if (find.hasOwnProperty('ecdis_genD') == false) {
            var ecdis_genD = req.body.ecdis_genD
        } else {
            var ecdis_genD = find.ecdis_genD[0].key
        }

        if (find.hasOwnProperty('ecdis_specificD') == false) {
            var ecdis_specificD = req.body.ecdis_specificD
        } else {
            var ecdis_specificD = find.ecdis_specificD[0].key
        }

        if (find.hasOwnProperty('SSOD') == false) {
            var SSOD = req.body.SSOD
        } else {
            var SSOD = find.SSOD[0].key
        }

        if (find.hasOwnProperty('leadership_managerialD') == false) {
            var leadership_managerialD = req.body.leadership_managerialD
        } else {
            var leadership_managerialD = find.leadership_managerialD[0].key
        }

        if (find.hasOwnProperty('high_voltageD') == false) {
            var high_voltageD = req.body.high_voltageD
        } else {
            var high_voltageD = find.high_voltageD[0].key
        }

        if (find.hasOwnProperty('leader_teamwork_deckD') == false) {
            var leader_teamwork_deckD = req.body.leader_teamwork_deckD
        } else {
            var leader_teamwork_deckD = find.leader_teamwork_deckD[0].key
        }

        if (find.hasOwnProperty('security_awaD') == false) {
            var security_awaD = req.body.security_awaD
        } else {
            var security_awaD = find.security_awaD[0].key
        }


        if (find.hasOwnProperty('security_dutiesD') == false) {
            var security_dutiesD = req.body.security_dutiesD
        } else {
            var security_dutiesD = find.security_dutiesD[0].key
        }

        if (find.hasOwnProperty('leader_teamwork_engineD') == false) {
            var leader_teamwork_engineD = req.body.leader_teamwork_engineD
        } else {
            var leader_teamwork_engineD = find.leader_teamwork_engineD[0].key
        }

        if (find.hasOwnProperty('security_awaD') == false) {
            var security_awaD = req.body.security_awaD
        } else {
            var security_awaD = find.security_awaD[0].key
        }


        // if (req.files.length <= 0) {
        //     return res.send(`You must select at least 1 file.`);
        // }

        // return res.send(`Files has been uploaded.`);
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {

            return res.send("Too many files to upload.");
        }
        // return res.send(`Error when trying upload many files: ${error}`);
    }





    const { first_name, last_name, email, phone, coc, expiration, covid_19, fitness, yellowF, PSSR, SURVIVAL, FFB, ADV, elementary, MAMS, FRC, medical_first, medical_care, GMDSS, RADAR, ARPA, arpa_btw, ecdis_gen, SSO, leadership_managerial, high_voltage, leader_teamwork_engine, leader_teamwork_deck, security_awa, security_duties, basic_saf_fam, security_related_fam, ecdis_specific } = req.body;
    // let searchTerm = req.body.search;



    //User the connection
    connection.query('INSERT INTO user SET ?', { user_id: decoded.id, first_name: first_name, last_name: last_name, email: email, phone: phone, coc: coc, expiration: expiration, covid_19: covid_19, covid_19D: covid_19D, fitness: fitness, fitnessD: fitnessD,  basic_saf_famD:basic_saf_famD, security_related_famD:security_related_famD, PSSRD:PSSRD, SURVD:SURVD, FFBD:FFBD, ADVD:ADVD, elementaryD:elementaryD, MAMSD:MAMSD, FRCD:FRCD, medical_firstD:medical_firstD, medical_careD:medical_careD, GMDSSD:GMDSSD, RADARD:RADARD, ARPAD:ARPAD, arpa_btwD:arpa_btwD, ecdis_genD:ecdis_genD, ecdis_specificD:ecdis_specificD, SSOD:SSOD, leadership_managerialD:leadership_managerialD, high_voltageD:high_voltageD, leader_teamwork_deckD:leader_teamwork_deckD, leader_teamwork_engineD:leader_teamwork_engineD, security_awaD:security_awaD, security_dutiesD:security_dutiesD,yellowF: yellowF, yellowFD: yellowFD, PSSR: PSSR, SURVIVAL: SURVIVAL, FFB: FFB, ADV: ADV, elementary: elementary, MAMS: MAMS, FRC: FRC, medical_first: medical_first, medical_care: medical_care, GMDSS: GMDSS, RADAR: RADAR, ARPA: ARPA, arpa_btw: arpa_btw, ecdis_gen: ecdis_gen, SSO: SSO, leadership_managerial: leadership_managerial, high_voltage: high_voltage, leader_teamwork_engine: leader_teamwork_engine, leader_teamwork_deck: leader_teamwork_deck, security_awa: security_awa, security_duties: security_duties, basic_saf_fam: basic_saf_fam, security_related_fam: security_related_fam, ecdis_specific: ecdis_specific }, (err, rows) => {
        if (!err) {
            res.render('add-crew', {layout: 'main2', alert: 'Crew member added succesfully!' });
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
            res.render('ui', {layout: 'main2', rows, removedUser });
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
            res.render('edit-crew', {layout: 'main2', rows });
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

        // console.log(req.files)
        // --FILE HANDLING BLOCKCODE---
        var find = JSON.parse(JSON.stringify(req.files));//  to remove Object:null prototype
        // conditional statments to hanlde the front end file existence.

        //---FILE MANAGMENT BLOCK CODE----

        if (find.hasOwnProperty('covid_19D') == false) {
            var covid_19D = req.body.covid_19D
        } else {
            var covid_19D = find.covid_19D[0].key

        }
       

        if (find.hasOwnProperty('fitnessD') == false) {
            var fitnessD = req.body.fitnessD
        } else {
            var fitnessD = find.fitnessD[0].key
        }

        if (find.hasOwnProperty('yellowFD') == false) {
            var yellowFD = req.body.yellowFD
        } else {
            var yellowFD = find.yellowFD[0].key
        }


        if (find.hasOwnProperty('basic_saf_famD') == false) {
            var basic_saf_famD = req.body.basic_saf_famD
        } else {
            var basic_saf_famD = find.basic_saf_famD[0].key
        }


        if (find.hasOwnProperty('security_related_famD') == false) {
            var security_related_famD = req.body.security_related_famD
        } else {
            var security_related_famD = find.security_related_famD[0].key
        }

        if (find.hasOwnProperty('PSSRD') == false) {
            var PSSRD = req.body.PSSRD
        } else {
            var PSSRD = find.PSSRD[0].key
        }

        if (find.hasOwnProperty('SURVD') == false) {
            var SURVD = req.body.SURVD
        } else {
            var SURVD = find.SURVD[0].key
        }

        if (find.hasOwnProperty('FFBD') == false) {
            var FFBD = req.body.FFBD
        } else {
            var FFBD = find.FFBD[0].key
        }

        if (find.hasOwnProperty('ADVD') == false) {
            var ADVD = req.body.ADVD
        } else {
            var ADVD = find.ADVD[0].key
        }


        if (find.hasOwnProperty('elementaryD') == false) {
            var elementaryD = req.body.elementaryD
        } else {
            var elementaryD = find.elementaryD[0].key
        }

        if (find.hasOwnProperty('MAMSD') == false) {
            var MAMSD = req.body.MAMSD
        } else {
            var MAMSD = find.MAMSD[0].key
        }

        if (find.hasOwnProperty('FRCD') == false) {
            var FRCD = req.body.FRCD
        } else {
            var FRCD = find.FRCD[0].key
        }

        if (find.hasOwnProperty('medical_firstD') == false) {
            var medical_firstD = req.body.medical_firstD
        } else {
            var medical_firstD = find.medical_firstD[0].key
        }

        if (find.hasOwnProperty('medical_careD') == false) {
            var medical_careD = req.body.medical_careD
        } else {
            var medical_careD = find.medical_careD[0].key
        }

        if (find.hasOwnProperty('GMDSSD') == false) {
            var GMDSSD = req.body.GMDSSD
        } else {
            var GMDSSD = find.GMDSSD[0].key
        }

        if (find.hasOwnProperty('RADARD') == false) {
            var RADARD = req.body.RADARD
        } else {
            var RADARD = find.RADARD[0].key
        }

        if (find.hasOwnProperty('ARPAD') == false) {
            var ARPAD = req.body.ARPAD
        } else {
            var ARPAD = find.ARPAD[0].key
        }

        if (find.hasOwnProperty('arpa_btwD') == false) {
            var arpa_btwD = req.body.arpa_btwD
        } else {
            var arpa_btwD = find.arpa_btwD[0].key
        }

        if (find.hasOwnProperty('ecdis_genD') == false) {
            var ecdis_genD = req.body.ecdis_genD
        } else {
            var ecdis_genD = find.ecdis_genD[0].key
        }

        if (find.hasOwnProperty('ecdis_specificD') == false) {
            var ecdis_specificD = req.body.ecdis_specificD
        } else {
            var ecdis_specificD = find.ecdis_specificD[0].key
        }

        if (find.hasOwnProperty('SSOD') == false) {
            var SSOD = req.body.SSOD
        } else {
            var SSOD = find.SSOD[0].key
        }

        if (find.hasOwnProperty('leadership_managerialD') == false) {
            var leadership_managerialD = req.body.leadership_managerialD
        } else {
            var leadership_managerialD = find.leadership_managerialD[0].key
        }

        if (find.hasOwnProperty('high_voltageD') == false) {
            var high_voltageD = req.body.high_voltageD
        } else {
            var high_voltageD = find.high_voltageD[0].key
        }

        if (find.hasOwnProperty('leader_teamwork_deckD') == false) {
            var leader_teamwork_deckD = req.body.leader_teamwork_deckD
        } else {
            var leader_teamwork_deckD = find.leader_teamwork_deckD[0].key
        }

        if (find.hasOwnProperty('security_awaD') == false) {
            var security_awaD = req.body.security_awaD
        } else {
            var security_awaD = find.security_awaD[0].key
        }


        if (find.hasOwnProperty('security_dutiesD') == false) {
            var security_dutiesD = req.body.security_dutiesD
        } else {
            var security_dutiesD = find.security_dutiesD[0].key
        }

        if (find.hasOwnProperty('leader_teamwork_engineD') == false) {
            var leader_teamwork_engineD = req.body.leader_teamwork_engineD
        } else {
            var leader_teamwork_engineD = find.leader_teamwork_engineD[0].key
        }

        if (find.hasOwnProperty('security_awaD') == false) {
            var security_awaD = req.body.security_awaD
        } else {
            var security_awaD = find.security_awaD[0].key
        }


// --- Multer error.code handling for unespected file and size limit---

    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE" || "LIMIT_FILE_SIZE") {

            return res.send("File larger than 3 MB are not allowed.");
        }
        // return res.send(`Error when trying upload many files: ${error}`);
    }



    // ---DATA ENTERING BLOCK CODE---

    var post = req.body;
    var first_name = post.first_name;
    var last_name = post.last_name;
    var email = post.email;
    var phone = post.phone;
    var coc = post.coc;
    var expiration = post.expiration;
    var covid_19 = post.covid_19;
    var fitness = post.fitness;
    var yellowF = post.yellowF;
    var PSSR = post.PSSR;
    var SURVIVAL = post.SURVIVAL;
    var FFB = post.FFB;
    var ADV = post.ADV;
    var elementary = post.elementary;
    var MAMS = post.MAMS;
    var FRC = post.FRC;
    var medical_first = post.medical_first;
    var medical_care = post.medical_care;
    var GMDSS = post.GMDSS;
    var RADAR = post.RADAR;
    var ARPA = post.ARPA;
    var arpa_btw = post.arpa_btw;
    var ecdis_gen = post.ecdis_gen;
    var SSO = post.SSO;
    var leadership_managerial = post.leadership_managerial;
    var high_voltage = post.high_voltage;
    var leader_teamwork_engine = post.leader_teamwork_engine;
    var leader_teamwork_deck = post.leader_teamwork_deck;
    var security_awa = post.security_awa;
    var security_duties = post.security_duties;
    var basic_saf_fam = post.basic_saf_fam;
    var security_related_fam = post.security_related_fam;
    var ecdis_specific = post.ecdis_specific;




    connection.query('UPDATE user SET first_name=? ,last_name=?, email=?, phone=?, coc=?, expiration=?, covid_19=?, covid_19D=?,  fitness=? ,fitnessD=?, yellowF=?, yellowFD=?, basic_saf_famD=?, security_related_famD=?, PSSR=?, PSSRD=?,  SURVD=?, FFBD=?,ADVD=?,  elementaryD=?, MAMSD=?, FRCD=?, medical_firstD=?, medical_careD=?, GMDSSD=?, RADARD=?, ARPAD=?, arpa_btwD=?, ecdis_genD=?, ecdis_specificD=?, SSOD=?, leadership_managerialD=?, high_voltageD=?, leader_teamwork_deckD=?,leader_teamwork_engineD=?, security_awaD=?, security_dutiesD=?,SURVIVAL=?, FFB=?, ADV=?, elementary=?, MAMS=?, FRC=?, medical_first=?, medical_care=?, GMDSS=?, RADAR=?, ARPA=?, arpa_btw=?, ecdis_gen=?, SSO=?, leadership_managerial=?, high_voltage=?, leader_teamwork_engine=?, leader_teamwork_deck=?, security_awa=?, security_duties=?, basic_saf_fam=?, security_related_fam=?,  ecdis_specific=?  WHERE id = ?', [first_name, last_name, email, phone, coc, expiration, covid_19, covid_19D, fitness, fitnessD, yellowF, yellowFD, basic_saf_famD, security_related_famD, PSSR, PSSRD, SURVD, FFBD, ADVD, elementaryD, MAMSD, FRCD, medical_firstD, medical_careD, GMDSSD, RADARD, ARPAD, arpa_btwD, ecdis_genD, ecdis_specificD, SSOD, leadership_managerialD, high_voltageD, leader_teamwork_deckD, leader_teamwork_engineD, security_awaD, security_dutiesD, SURVIVAL, FFB, ADV, elementary, MAMS, FRC, medical_first, medical_care, GMDSS, RADAR, ARPA, arpa_btw, ecdis_gen, SSO, leadership_managerial, high_voltage, leader_teamwork_engine, leader_teamwork_deck, security_awa, security_duties, basic_saf_fam, security_related_fam, ecdis_specific, req.params.id],
        (err, rows) => {

            if (!err) {
                connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                    if (!err) {
                        res.render('edit-crew', {layout: 'main2', rows, alert: `${first_name} has been updated.` });


                    } else {
                        console.log(err);
                    }
                    // console.log('The data from user table:\n', rows);
                });
            } else {
                console.log(err);
            }
            // console.log('The data from user table:\n', rows);
        });

}


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
            res.render('view-crew', { layout: 'main2',rows });

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








