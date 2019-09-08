const passport = require('passport');
const User = require('../models/user');
const LocalStategy = require('passport-local').Strategy;
const bcrytjs = require("bcryptjs");
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});
passport.use('local.signup', new LocalStategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        $or: [
            { email },
            { 'username': req.body.username }
        ]
    }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            if (user.username === req.body.username)
                return done(null, false, req.flash('error', 'Username alrealy exist'));
            else
                return done(null, false, req.flash('error', 'Email alrealy exist'));
        }
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save((err) => {
            done(null, newUser);
        });
    })
}))
passport.use('local.signin', new LocalStategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user || !user.comparePassword(password)) {
            return done(null, false, req.flash('error', 'email or pass is Invalid'));
        }
        return done(null, user);
    })
}))