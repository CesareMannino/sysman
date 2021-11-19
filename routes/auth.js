const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


//routing for the auth

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout',authController.logout);

module.exports = router;