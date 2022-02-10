const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    
    callback(null, path.join(`${__dirname}/../upload`));
  },
  filename: (req, file, callback) => {
   
    const match = ["image/png", "image/jpeg", "application/pdf"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `<strong>${file.originalname}</strong> is invalid. Only accept png/jpeg/pdf.`;
      return callback(message, null);
    }

    var filename =`${Date.now()}${file.originalname}`;
    callback(null, filename);
  
    
    
  }
});

var uploadFiles = multer({ storage: storage }).fields([{name:"covid_19D", maxCount:1},{name:"fitnessD",maxCount:1},{name:"yellowFD",maxCount:1}])

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

