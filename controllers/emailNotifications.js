const mysql = require('mysql');
const nodemailer = require('nodemailer');
const moment = require('moment');

// MySQL Database Configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

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
  const query = `SELECT * FROM user WHERE last_updated > '${lastCheckedTimestamp.format('YYYY-MM-DD HH:mm:ss')}' AND ((certificate_of_competence_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR covid_19_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR fitness_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR yellowF_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR PSSR_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR SURVIVAL_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR FFB_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ADV_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR elementary_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR MAMS_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR FRC_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR medical_first_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR medical_care_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR GMDSS_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR RADAR_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ARPA_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR arpa_btw_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ecdis_gen_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR SSO_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leadership_managerial_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR high_voltage_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leader_teamwork_engine_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leader_teamwork_deck_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_awa_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_duties_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR basic_saf_fam_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_related_fam_date <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ecdis_specific_date <= DATE_ADD(NOW(), INTERVAL 30 DAY))) GROUP BY user.id`;

  db.query(query, async (err, results) => {
    if (err) {
      console.error('MySQL Query Error:', err);
    } else {
      console.log('New Records with Expiring Training Courses:', results);
      const emailPromises = results.map((user) => sendEmailNotification(user));
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

// Email Notification Function
// Email Notification Function
async function sendEmailNotification(user, additionalEmails = []) {
  let expiringCertificates = [];

  // Loop through each property in the user object
  for (let property in user) {
    // Check if the property is a date type column
    if (property.endsWith('_date')) {
      const propName = property.replace(/_/g, ' ').replace('date', '');

      // Check if the date is within the next 30 days and not empty
      const currentDate = moment();
      const expirationDate = moment(user[property], 'YYYY-MM-DD');
      const isExpiringSoon = expirationDate.isBetween(currentDate, currentDate.clone().add(30, 'days'));
      const isNotEmpty = user[property] !== null && user[property] !== '';

      if (isExpiringSoon && isNotEmpty) {
        expiringCertificates.push({
          name: propName,
          expirationDate: expirationDate.format('MMMM Do YYYY')
        });
      }
    }
  }

  if (expiringCertificates.length > 0) {
    const certificateList = expiringCertificates.map(cert => `"${cert.name}" - expires on ${cert.expirationDate}`).join('\n');
    const message = {
      from: process.env.EMAIL_USER,
      to: [user.email, ...additionalEmails].join(', '), // Concatenate additional emails here
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
