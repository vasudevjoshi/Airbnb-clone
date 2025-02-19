const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const controllerUser =require('../controllers/user');

    router.route('/signup')
    .get(controllerUser.renderSignup)
    .post(wrapAsync(controllerUser.singup));

    router.route('/login')
    .get(controllerUser.renderLogin)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), controllerUser.login);

    router.get('/logout',controllerUser.logout);

    
module.exports = router;