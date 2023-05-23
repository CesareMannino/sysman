const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


//routing for the auth

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout',authController.logout);


router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { layout: 'main' })
});



router.post('/forgot-password', authController.forgotPassword);

router.get('/reset-password', (req, res) => {
  res.render('reset-password', { layout: 'main', resetToken: req.query.token })
});


router.post('/reset-password', authController.resetPassword);




module.exports = router;