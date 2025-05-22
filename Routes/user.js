const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/users");


router.route('/signup')
.get(userController.signupForm)
.post(wrapAsync(userController.registrationRoute));

router.route('/login')
.get(userController.loginForm)
.post(saveRedirectUrl
,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
,wrapAsync(userController.loggingRoute));


//Logout
router.get('/logout',userController.logoutRoute);

module.exports = router;