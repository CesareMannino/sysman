const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController')
// const uploadController = require("../controllers/upload");





//routing for the home page



router.get('/', (req, res) => {
  res.render('home', { layout: 'main' })
});


// routing for the register page
router.get('/register', (req, res) => {
  res.render('register', { layout: 'main' })
});

router.get('/login', (req, res) => {
  res.render('login', { layout: 'main' })
});






router.get('/profile', authController.isLoggedIn, (req, res) => {
  // console.log(req.user);
  if (req.user) {
    res.render('profile', { layout: 'main', user: req.user });
  } else {
    res.redirect('/login');
  }
});

router.post('/profile', userController.updateUser);


function checkAuth(req, res, next) {
  if (!req.cookies.jwt) {
    res.redirect('/login');
  } else {
    next();
  }
}
router.get('/ui', checkAuth, authController.isLoggedIn, userController.view, (req, res) => {

  res.render('ui', { user: req.user });

});

// router.get('/upload/:pic', function (req, res) {
//   var file = __dirname + '/../upload/' + req.params.pic;
//   res.download(file);
// });

router.get('/index', userController.readfile);


router.get('/ui', userController.view);
router.post('/ui', userController.find);

router.get('/addcrew', userController.form);
router.post('/addcrew', userController.create);

// router.get('/profile/:id', userController.editProfile);



router.get('/editcrew/:id', userController.edit);

router.post('/editcrew/:id', userController.update);

router.get('/viewcrew/:id', userController.viewall);



router.get('/viewcrew/:id', userController.viewall);


// router.get('/viewcrew/:profile_image', function (req, res,next) {
//   res.download(`${__dirname}/upload/${req.params.profile_image}.pdf`);
// });

router.get('/:id', userController.delete);

module.exports = router;


