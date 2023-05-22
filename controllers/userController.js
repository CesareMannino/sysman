const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const upload = require("../middleware/upload");
const emailNotifications = require('./emailNotifications');
require('dotenv').config();
const util = require('util');

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

const query = util.promisify(connection.query).bind(connection);




//find user by Search
exports.find = (req, res) => {
    let searchTerm = req.body.search;
    //User the connection
    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        if (!err) {
            res.render('ui', { layout: 'main2', rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table:\n', rows);
    });
};

exports.form = (req, res) => {
    res.render('add-crew', { layout: 'main2' });
}

//Add crew member
exports.create = async (req, res, next) => {
    let decoded;
    let data = {};
    if (req.cookies.jwt) {
        try {
            //1)verify the token
            decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            //2) Check if the user still exists
            connection.query('SELECT * FROM login WHERE id = ?', [decoded.id], (error, result) => {
                if (error || !result) {
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

        const find = JSON.parse(JSON.stringify(req.files)); // to remove Object:null prototype

        const fields = [
            'covid_19D', 'fitnessD', 'yellowFD', 'basic_saf_famD', 'security_related_famD', 'PSSRD', 'SURVD', 'FFBD', 'ADVD', 'elementaryD', 'MAMSD', 'FRCD', 'medical_firstD', 'medical_careD', 'GMDSSD', 'RADARD', 'ARPAD', 'arpa_btwD', 'ecdis_genD', 'ecdis_specificD', 'SSOD', 'leadership_managerialD', 'high_voltageD', 'leader_teamwork_deckD', 'leader_teamwork_engineD', 'security_awaD', 'security_dutiesD'
        ];

        fields.forEach(field => {
            data[field] = find.hasOwnProperty(field) ? find[field][0].key : req.body[field];
        });

    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE" || "LIMIT_FILE_SIZE") {
            return res.status(400).send("File larger than 3 MB are not allowed.");
        }
    }

    const insertData = {
        user_id: decoded.id,
        ...req.body,
        ...data
    };

    connection.query('INSERT INTO user SET ?', insertData, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('An error occurred while adding crew member');
        } else {
            console.log(results);
            return res.render('add-crew', {
                layout: 'main2',
                alert: 'Crew member added successfully!'
            });
        }
    });
};



exports.editProfile = (req, res) => {
    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
            if (rows.length > 0) {
                res.render('profile', { rows });
                console.log(rows)
            } else {
                // handle case where no user was found
                res.status(404).send('User not found');
            }
        } else {
            console.log(err);
        }
    });
}





//controller to add the email address form the account page
exports.updateUser = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).send('Authentication required');
        }

        //1) Verify the token
        const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

        //2) Check if the user still exists
        const [result] = await query('SELECT * FROM login WHERE id = ?', [decoded.id]);

        if (!result) {
            return res.status(404).send('User not found');
        }

        // Validate email inputs (Add your validation logic here)
        var post = req.body
        var email1 = post.email1
        var email2 = post.email2
        console.log(email1)
        // const { email1, email2 } = req.body;

        // Get user's ID from the decoded token
        const userId = decoded.id;
console.log(userId)
        // Create your MySQL query
        const sql = "UPDATE login SET email1 = ?, email2 = ? WHERE id = ?";

        // Execute the query
        await query(sql, [email1, email2, userId]);

        res.send('Notification email addresses updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};



// View all crew member for ui page
exports.view = (req, res) => {

    //Fetch the view data from database where the user_id is passed
    // as variable [decoded.id] so it will fetch only data for that particualr user_id on user table 
    connection.query('SELECT * FROM user WHERE user_id=?', [decoded.id], (err, rows) => {
        //when done with the connection, release it
        if (!err) {
            let removedUser = req.query.removed;
            res.render('ui', { layout: 'main2', rows, removedUser });

        } else {
            console.log(err);
        }
        // console.log('The data from user table:\n', rows);
    });
};

emailNotifications
console.log(emailNotifications)

// edit crew function
exports.edit = (req, res) => {
    //User the connection
    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
            res.render('edit-crew', { layout: 'main2', rows });
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

            return res.send("File larger than 3 MB are not allowed ciao.");
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
    var certificate_of_competence_date = post.certificate_of_competence_date;
    var covid_19_date = post.covid_19_date;
    var fitness_date = post.fitness_date;
    var yellowF_date = post.yellowF_date;
    var PSSR_date = post.PSSR_date;
    var SURVIVAL_date = post.SURVIVAL_date;
    var FFB_date = post.FFB_date;
    var ADV_date = post.ADV_date;
    var elementary_date = post.elementary_date;
    var MAMS_date = post.MAMS_date;
    var FRC_date = post.FRC_date;
    var medical_first_date = post.medical_first_date;
    var medical_care_date = post.medical_care_date;
    var GMDSS_date = post.GMDSS_date;
    var RADAR_date = post.RADAR_date;
    var ARPA_date = post.ARPA_date;
    var arpa_btw_date = post.arpa_btw_date;
    var ecdis_gen_date = post.ecdis_gen_date;
    var SSO_date = post.SSO_date;
    var leadership_managerial_date = post.leadership_managerial_date;
    var high_voltage_date = post.high_voltage_date;
    var leader_teamwork_engine_date = post.leader_teamwork_engine_date;
    var leader_teamwork_deck_date = post.leader_teamwork_deck_date;
    var security_awa_date = post.security_awa_date;
    var security_duties_date = post.security_duties_date;
    var basic_saf_fam_date = post.basic_saf_fam_date;
    var security_related_fam_date = post.security_related_fam_date;
    var ecdis_specific_date = post.ecdis_specific_date;



    connection.query('UPDATE user SET first_name=? ,last_name=?, email=?, phone=?, coc=?, certificate_of_competence_date=?, covid_19_date=?, covid_19D=?,  fitness_date=? ,fitnessD=?, yellowF_date=?, yellowFD=?, basic_saf_famD=?, security_related_famD=?, PSSR_date=?, PSSRD=?,  SURVD=?, FFBD=?,ADVD=?,  elementaryD=?, MAMSD=?, FRCD=?, medical_firstD=?, medical_careD=?, GMDSSD=?, RADARD=?, ARPAD=?, arpa_btwD=?, ecdis_genD=?, ecdis_specificD=?, SSOD=?, leadership_managerialD=?, high_voltageD=?, leader_teamwork_deckD=?,leader_teamwork_engineD=?, security_awaD=?, security_dutiesD=?,SURVIVAL_date=?, FFB_date=?, ADV_date=?, elementary_date=?, MAMS_date=?, FRC_date=?, medical_first_date=?, medical_care_date=?, GMDSS_date=?, RADAR_date=?, ARPA_date=?, arpa_btw_date=?, ecdis_gen_date=?, SSO_date=?, leadership_managerial_date=?, high_voltage_date=?, leader_teamwork_engine_date=?, leader_teamwork_deck_date=?, security_awa_date=?, security_duties_date=?, basic_saf_fam_date=?, security_related_fam_date=?,  ecdis_specific_date=?  WHERE id = ?', [first_name, last_name, email, phone, coc, certificate_of_competence_date, covid_19_date, covid_19D, fitness_date, fitnessD, yellowF_date, yellowFD, basic_saf_famD, security_related_famD, PSSR_date, PSSRD, SURVD, FFBD, ADVD, elementaryD, MAMSD, FRCD, medical_firstD, medical_careD, GMDSSD, RADARD, ARPAD, arpa_btwD, ecdis_genD, ecdis_specificD, SSOD, leadership_managerialD, high_voltageD, leader_teamwork_deckD, leader_teamwork_engineD, security_awaD, security_dutiesD, SURVIVAL_date, FFB_date, ADV_date, elementary_date, MAMS_date, FRC_date, medical_first_date, medical_care_date, GMDSS_date, RADAR_date, ARPA_date, arpa_btw_date, ecdis_gen_date, SSO_date, leadership_managerial_date, high_voltage_date, leader_teamwork_engine_date, leader_teamwork_deck_date, security_awa_date, security_duties_date, basic_saf_fam_date, security_related_fam_date, ecdis_specific_date, req.params.id],
        (err, rows) => {

            if (!err) {
                connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                    if (!err) {
                        res.render('edit-crew', { layout: 'main2', rows, alert: `${first_name} has been updated.` });


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
    connection.query(
        `SELECT id, first_name,last_name, email, phone, covid_19D, fitnessD,yellowFD, basic_saf_famD, security_related_famD, PSSRD, SURVD, FFBD, ADVD, elementaryD, MAMSD, FRCD, medical_firstD, medical_careD, GMDSSD, RADARD, ARPAD, arpa_btwD, ecdis_genD, ecdis_specificD, SSOD, leadership_managerialD, high_voltageD, leader_teamwork_deckD, leader_teamwork_engineD, security_awaD, security_dutiesD,
      DATE_FORMAT(certificate_of_competence_date, "%M %d, %Y") as certificate_of_competence_date, 
      DATE_FORMAT(covid_19_date, "%M %d, %Y") as covid_19_date, 
      DATE_FORMAT(fitness_date, "%M %d, %Y") as fitness_date, 
      DATE_FORMAT(yellowF_date, "%M %d, %Y") as yellowF_date, 
      DATE_FORMAT(PSSR_date, "%M %d, %Y") as PSSR_date, 
      DATE_FORMAT(SURVIVAL_date, "%M %d, %Y") as SURVIVAL_date, 
      DATE_FORMAT(FFB_date, "%M %d, %Y") as FFB_date, 
      DATE_FORMAT(ADV_date, "%M %d, %Y") as ADV_date, 
      DATE_FORMAT(elementary_date, "%M %d, %Y") as elementary_date, 
      DATE_FORMAT(MAMS_date, "%M %d, %Y") as MAMS_date, 
      DATE_FORMAT(FRC_date, "%M %d, %Y") as FRC_date, 
      DATE_FORMAT(medical_first_date, "%M %d, %Y") as medical_first_date, 
      DATE_FORMAT(medical_care_date, "%M %d, %Y") as medical_care_date, 
      DATE_FORMAT(GMDSS_date, "%M %d, %Y") as GMDSS_date, 
      DATE_FORMAT(RADAR_date, "%M %d, %Y") as RADAR_date, 
      DATE_FORMAT(ARPA_date, "%M %d, %Y") as ARPA_date, 
      DATE_FORMAT(arpa_btw_date, "%M %d, %Y") as arpa_btw_date, 
      DATE_FORMAT(ecdis_gen_date, "%M %d, %Y") as ecdis_gen_date, 
      DATE_FORMAT(SSO_date, "%M %d, %Y") as SSO_date, 
      DATE_FORMAT(leadership_managerial_date, "%M %d, %Y") as leadership_managerial_date, 
      DATE_FORMAT(high_voltage_date, "%M %d, %Y") as high_voltage_date, 
      DATE_FORMAT(leader_teamwork_engine_date, "%M %d, %Y") as leader_teamwork_engine_date, 
      DATE_FORMAT(leader_teamwork_deck_date, "%M %d, %Y") as leader_teamwork_deck_date, 
      DATE_FORMAT(security_awa_date, "%M %d, %Y") as security_awa_date, 
      DATE_FORMAT(security_duties_date, "%M %d, %Y") as security_duties_date, 
      DATE_FORMAT(basic_saf_fam_date, "%M %d, %Y") as basic_saf_fam_date, 
      DATE_FORMAT(security_related_fam_date, "%M %d, %Y") as security_related_fam_date, 
      DATE_FORMAT(ecdis_specific_date, "%M %d, %Y") as ecdis_specific_date 
      FROM user 
      WHERE id=?`,
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render('view-crew', { layout: 'main2', rows });
            } else {
                console.log(err);
            }
        }
    );
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








