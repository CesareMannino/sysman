const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



//routing for the auth

router.post('/register', authController.register);

module.exports = router;