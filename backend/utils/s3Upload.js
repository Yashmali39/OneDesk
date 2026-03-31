const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

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