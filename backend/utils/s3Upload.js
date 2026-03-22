const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("../config/aws-config");

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "onedesk-complaints",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `complaints/${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = upload;