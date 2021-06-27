const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');



//create, find, update,delete
//client controller
router.get('/', clientController.view);
//user contoller
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/ui', userController.view);
router.post('/ui', userController.find);
router.get('/addcrew', userController.form);
router.post('/addcrew', userController.create);
router.get('/editcrew/:id',userController.edit);
router.post('/editcrew/:id',userController.update);
router.get('/viewcrew/:id',userController.viewall);
router.get('/:id', userController.delete);

module.exports = router;