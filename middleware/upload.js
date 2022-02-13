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

var uploadFiles = multer({ storage: storage }).fields([{name:"covid_19D", maxCount:1},
{name:"fitnessD",maxCount:1},
{name:"yellowFD",maxCount:1},
{name:"basic_saf_famD",maxCount:1},
{name:"security_related_famD",maxCount:1},
{name:"PSSRD",maxCount:1},
{name:"SURVD",maxCount:1},
{name:"FFBD",maxCount:1},
{name:"ADVD",maxCount:1},
{name:"elementaryD",maxCount:1},
{name:"MAMSD",maxCount:1},
{name:"FRCD",maxCount:1},
{name:"medical_firstD",maxCount:1},
{name:"medical_careD",maxCount:1},
{name:"GMDSSD",maxCount:1},
{name:"RADARD",maxCount:1},
{name:"ARPAD",maxCount:1},
{name:"arpa_btwD",maxCount:1},
{name:"ecdis_genD",maxCount:1},
{name:"ecdis_specificD",maxCount:1},
{name:"SSOD",maxCount:1},
{name:"leadership_managerialD",maxCount:1},
{name:"high_voltageD",maxCount:1},
{name:"leader_teamwork_deckD",maxCount:1},
{name:"leader_teamwork_engineD",maxCount:1},
{name:"security_awaD",maxCount:1},
{name:"security_dutiesD",maxCount:1}])

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

