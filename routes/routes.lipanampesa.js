const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controllers.lipanampesa.js");
const middlewares = require("../middlewares/middlewares.generateAccessToken.js");

router.route('/stkPush').post(middlewares.accessToken, controllers.initiateSTKPush);
router.route('/stkPushCallback/:Order_ID').post(controllers.stkPushCallback);
router.route('/confirmPayment/:CheckoutRequestID').post(middlewares.accessToken, controllers.confirmPayment);

module.exports = router;
