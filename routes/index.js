const express = require("express");
const router = express.Router();
const openRouteController = require("../controllers/openRouteController");
const VerifyToken = require("../_middlewares/VerifyToken");
const multer = require("multer");
const upload = multer();

/* GET home page. */
router.get("/", openRouteController.index);

router.get("/test", openRouteController.test);

router.get("/protected", VerifyToken, openRouteController.protected);

module.exports = router;
