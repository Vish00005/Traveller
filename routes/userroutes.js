const express = require("express");
const wrapAsync = require("../util/wrapAsync");
const router = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const {saveRedirectUrl}  = require("../util/isLoggedIn.js");
const userroutes = require("../controller/user.js")

router.get("/signup", userroutes.signupGet );
router.post(
  "/signup",
  wrapAsync(userroutes.signupPost)
);

router.get("/login",userroutes.loginGet );

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userroutes.loginPost
);

router.get("/logout",userroutes.logout)

module.exports = router;
