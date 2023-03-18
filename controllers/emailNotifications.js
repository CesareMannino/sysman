const mysql = require('mysql');
const nodemailer = require('nodemailer');
const moment = require('moment')

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
    user: 'cesaremannino',
    pass: 'zigxqihhjoihvddb'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email Notification Function
function sendEmailNotification(user) {
  // Loop through each property in the user object
  for (let property in user) {
    // Check if the property is a date type column
    if (user[property] instanceof Date) {
      // Compose Email Message
      const message = {
        from: 'cesaremannino@gmail.com',
        to: user.email,
        subject: 'Certificate Expiration Reminder',
        text: `Dear ${user.first_name} ${user.last_name},\n\nThis is a reminder that your ${property} certificate expires on ${moment(user[property]).format('MMMM Do YYYY')}.\n\nBest regards,\nTraining Team`
      };

      // Send Email Notification
      transporter.sendMail(message, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }
}

// Query MySQL Database for Expired Training Courses
const query = 'SELECT * FROM user WHERE (certificate_of_competence <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR covid_19 <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR fitness <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR yellowF <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR PSSR <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR SURVIVAL <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR FFB <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ADV <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR elementary <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR MAMS <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR FRC <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR medical_first <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR medical_care <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR GMDSS <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR RADAR <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ARPA <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR arpa_btw <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ecdis_gen <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR SSO <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leadership_managerial <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR high_voltage <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leader_teamwork_engine <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR leader_teamwork_deck <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_awa <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_duties <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR basic_saf_fam <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR security_related_fam <= DATE_ADD(NOW(), INTERVAL 30 DAY) OR ecdis_specific <= DATE_ADD(NOW(), INTERVAL 30 DAY))';
db.query(query, (err, results) => {
  if (err) {
    console.error('MySQL Query Error:', err);
  } else {
    console.log('Expired Training Courses:', results);
    results.forEach((user) => {
      sendEmailNotification(user);
    });
  }
});


// Close MySQL Database Connection
db.end((err) => {
  if (err) {
    console.error('MySQL Database Closing Error:', err);
  } else {
    console.log('MySQL Database Closed Successfully');
  }
});
