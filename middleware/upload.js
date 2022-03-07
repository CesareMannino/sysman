const util = require("util");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

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

    var filename = `${Date.now()}${file.originalname}`;
    callback(null, filename);



  }
});




const  accessKeyId = 'AKIARQZCUZGTL2KHK6WK';
const secretAccessKey = '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';


const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  
});

var uploadFiles = multer({
  limits: { fileSize: 10000000 }, 
  storage:  multerS3({
    s3: s3,
    bucket: 'uploadvms',
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}${file.originalname}`)
    }
  })
}).fields([{ name: "covid_19D", maxCount: 1 },
{ name: "fitnessD", maxCount: 1 },
{ name: "yellowFD", maxCount: 1 },
{ name: "basic_saf_famD", maxCount: 1 },
{ name: "security_related_famD", maxCount: 1 },
{ name: "PSSRD", maxCount: 1 },
{ name: "SURVD", maxCount: 1 },
{ name: "FFBD", maxCount: 1 },
{ name: "ADVD", maxCount: 1 },
{ name: "elementaryD", maxCount: 1 },
{ name: "MAMSD", maxCount: 1 },
{ name: "FRCD", maxCount: 1 },
{ name: "medical_firstD", maxCount: 1 },
{ name: "medical_careD", maxCount: 1 },
{ name: "GMDSSD", maxCount: 1 },
{ name: "RADARD", maxCount: 1 },
{ name: "ARPAD", maxCount: 1 },
{ name: "arpa_btwD", maxCount: 1 },
{ name: "ecdis_genD", maxCount: 1 },
{ name: "ecdis_specificD", maxCount: 1 },
{ name: "SSOD", maxCount: 1 },
{ name: "leadership_managerialD", maxCount: 1 },
{ name: "high_voltageD", maxCount: 1 },
{ name: "leader_teamwork_deckD", maxCount: 1 },
{ name: "leader_teamwork_engineD", maxCount: 1 },
{ name: "security_awaD", maxCount: 1 },
{ name: "security_dutiesD", maxCount: 1 }])


// exports.upload = multer({ storage });

// exports.uploadS3 = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET,
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

