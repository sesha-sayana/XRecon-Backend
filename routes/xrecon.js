const express = require("express");
const router = express.Router();
const path = require("path");
const VerifyToken = require("../_middlewares/VerifyToken");
const xreconController = require("../controllers/xreconController");
const paylodValidation = require("../_middlewares/paylodValidation");
const validationSchemas = require("../helpers/validationSchemas");

// multer config
const multer = require("multer");
const upload = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, process.env.UPLOADS_PATH || "./tmp/uploads");
  //   },
  //   filename: (req, file, cb) => {
  //     let ext = path.extname(file.originalname);
  //     cb(null, `${file.originalname.split(".")[0]}-${Date.now()}${ext}`);
  //   },
  // }),
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== ".csv") {
      return callback(new Error("Invalid file"));
    }
    callback(null, true);
  },
});

router.post(
  "/wallet/verify",
  // VerifyToken,
  // paylodValidation(validationSchemas.fundCreateSchema),
  upload.single("csv"),
  xreconController.walletVerify
);

module.exports = router;
