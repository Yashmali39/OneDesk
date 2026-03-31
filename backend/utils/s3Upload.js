const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/aws-config");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "onedesk-complaints",
    // ❌ REMOVE acl line
    key: function (req, file, cb) {
      cb(null, `complaints/${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = upload;