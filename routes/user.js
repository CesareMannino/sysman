const express = require('express');
const mysql = require('mysql');
const authController= require('../controllers/authController')
const userController = require('../controllers/userController');
const router = express.Router();



//routing for the home page

router.get('/', (req, res) => {
  res.render('home', { layout: 'main2' })
});

// routing for the register page
router.get('/register', (req, res) => {
  res.render('register', { layout: 'main2' })
});

router.get('/login', (req, res) => {
  res.render('login', { layout: 'main2' })
});


router.get('/profile', authController.isLoggedIn,(req,res)=>{
  console.log(req.user);
  if(req.user){
  res.render('profile',{layout: 'main2', user : req.user});
} else{
res.redirect('/login');
} 
});


// router.get('/ui', authController.isLoggedIn,userController.view,(req,res,)=>{
//   if(req.user){
//     res.render('ui');
//   } else{
//     res.redirect('/login');
//   }
//   });

router.get('/ui', userController.view);
router.post('/ui', userController.find);
router.get('/addcrew', userController.form);
router.post('/addcrew', userController.create);
router.get('/editcrew/:id', userController.edit);
router.post('/editcrew/:id', userController.update);
router.get('/viewcrew/:id', userController.viewall);
router.get('/:id', userController.delete);

module.exports = router;