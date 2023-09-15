const mysql = require('mysql');
const nodemailer = require('nodemailer');
const moment = require('moment');
const crypto = require('crypto');

// MySQL Database Configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});



// var db = mysql.createConnection ({
//     host: process.env.RDS_HOSTNAME,
//     user: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     database: process.env.RDS_DB_NAME,
//     port: process.env.RDS_PORT
// });



// Establish MySQL Database Connection
db.connect((err) => {
  if (err) {
    console.error('MySQL Database Connection Error:', err);
  } else {
    console.log('MySQL Database Connected Successfully');
  }
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ... (previous imports and configurations)


let lastCheckedTimestamp = moment();
// let lastCheckedUserId = 0;

function checkForNewRecords() {
  const query = `SELECT user.*, login.email1, login.email2
  FROM user
  INNER JOIN login ON user.user_id = login.id
  WHERE last_updated > '${lastCheckedTimestamp.format('YYYY-MM-DD HH:mm:ss')}'
  AND (
    (certificate_of_competence_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (fitness_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (PSSR_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (SURVIVAL_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (FFB_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (ADV_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (elementary_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (MAMS_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (FRC_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (medical_first_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (medical_care_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (GMDSS_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (RADAR_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (ARPA_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (arpa_btw_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (ecdis_gen_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (SSO_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (leadership_managerial_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (high_voltage_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (leader_teamwork_engine_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (leader_teamwork_deck_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (security_awa_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (security_duties_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
    OR (ecdis_specific_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))
  )
  GROUP BY user.id
  `;

  db.query(query, async (err, results) => {
    if (err) {
      console.error('MySQL Query Error:', err);
    } else {
      console.log('New Records with Expiring Training Courses:', results);
      const emailPromises = results.map((user) =>{
      // Extract additional emails from the user object
      const additionalEmails = [user.email1, user.email2];
      return sendEmailNotification(user, additionalEmails);
      });

      await Promise.all(emailPromises);  
      // Update the last checked timestamp
      lastCheckedTimestamp = moment();
    }
  });
  
}






// Query MySQL Database for New Records with Expiring Training Courses
checkForNewRecords();
setInterval(checkForNewRecords, 1 * 60 * 1000); // Check for new records every 1 minute

// ... (rest of the code, including sendEmailNotification function)

const certificateNameMapping = {
  'certificate_of_competence_date': 'Certificate of Competence',
  'fitness_date': 'Medical fitness certificate',
  'PSSR_date': 'PSSR certificate STCW A-VI/1-4',
  'SURVIVAL_date': 'Personal survival tecniques STCW A-VI/1-1',
  'FFB_date': 'Fire fighting base STCW A-VI/1-2', 
  'ADV_date': 'Advanced fire fighting STCW A-VI/3',
  'elementary_date': 'Elementary first aid STCW A-VI/1-3',
  'MAMS_date': 'Proficiency in survival crafts STCW A-II/2',
  'FRC_date': 'Fast rescue crafts STCW A-VI/2',
  'medical_first_date': 'Medical first aid STCW A-VI/4-1',
  'medical_care_date': 'Medical care STCW A-VI/4-2',
  'GMDSS_date': 'GMDSS certificate STCW A-IV/2',
  'RADAR_date': 'RADAR STCW A-II/1',
  'ARPA_date':  'ARPA STCW A-II/1 - A-II/2',
  'arpa_btw_date': 'RADAR arpa bridge team work STCW A-II/2',
  'ecdis_gen_date': 'ECDIS generic training STCW A-II/1, A-II/2',
  'SSO_date': 'Ship security officer STCW A-VI/5', 
  'leadership_managerial_date': 'USE OF LEADERSHIP AND MANAGERIAL SKILLS COURSE',
  'high_voltage_date': 'MARINE HIGH VOLTAGE',
  'leader_teamwork_engine_date': 'Leadership & teamwork engine STCW A-II/1, A-II/2',
  'leader_teamwork_deck_date': 'Leadeship & teamwork deck STCW A-II/1, A-II/2', 
  'security_awa_date': 'Security awarness STCW A-VI/6-1',
  'security_duties_date': 'Seaferer with designated security duties STCW A-VI/6-2',
  'ecdis_specific_date':"ECDIS Ship's specific equipment familiarization"
  

  
};


// Email Notification Function
async function sendEmailNotification(user, additionalEmails = []) {
  let expiringCertificates = [];

  // Loop through each property in the certificateNameMapping object
  for (const columnName in certificateNameMapping) {
    const expirationDate = moment(user[columnName], 'YYYY-MM-DD');
    const isExpiringSoon = expirationDate.isBetween(
      moment(),
      moment().add(30, 'days')
    );
    
    if (isExpiringSoon) {
      expiringCertificates.push({
        name: certificateNameMapping[columnName],
        expirationDate: expirationDate.format('MMMM Do YYYY')
      });
    }
  }

  if (expiringCertificates.length > 0) {
    const certificateList = expiringCertificates.map(
      cert => `"${cert.name}" - expires on ${cert.expirationDate}`
    ).join('\n');

    const message = {
      from: process.env.EMAIL_USER,
      to: [user.email, ...additionalEmails].join(', '),
      subject: 'Certificate Expiration Reminder',
      text: `Dear ${user.first_name} ${user.last_name},\n\nThis is a reminder that the following certificates are expiring within the next 30 days:\n\n${certificateList}\n\nBest regards,\nTraining Team`
    };

    // Send Email Notification
    await transporter.sendMail(message);

    // Update email_sent column in the user table to true
    const updateQuery = `UPDATE user SET email_sent = TRUE WHERE user_id = ${user.user_id}`;
    db.query(updateQuery, (err) => {
      if (err) {
        console.error(`Error updating email_sent flag for user ${user.user_id}:`, err);
      } else {
        console.log(`Email sent to user ${user.user_id}`);
      }
    });
  }
}


async function sendResetPasswordEmail(login, resetToken, additionalEmails = []) {
  const resetPasswordUrl = `http://127.0.0.1:5000/auth/reset-password?token=${resetToken}`;

  const message = {
      from: process.env.EMAIL_USER,
      to: [login.email, ...additionalEmails].join(', '), // Concatenate additional emails here
      subject: 'Password Reset',
      text: `Dear ${login.name} ,\n\nYou have requested to reset your password. Please follow the link below to set a new password:\n\n${resetPasswordUrl}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYour Team`
  };

  // Send Email
  await transporter.sendMail(message);

  console.log(`Password reset email sent to user ${login.id}`);
}

module.exports = {
  sendResetPasswordEmail,
  // other exported functions...
};

