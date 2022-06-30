const authRouter = require("express").Router();
const passport = require('passport');



authRouter.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));
// xử lý sau khi user cho phép xác thực với facebook
authRouter.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })
);

module.exports = authRouter;