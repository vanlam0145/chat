const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys');
const GoogleStategy = require("passport-google-oauth").OAuth2Strategy;
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});
passport.use(new GoogleStategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    //profileFields: ['email', 'displayName','photos'],
    callbackURL: keys.google.deploy(),
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    //console.log("GOOGLE: ",profile);
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) {

            return done(err);
        }
        if (user) {
            return done(null, user);
        }
        else {

            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = profile._json.picture;
            //newUser.fbToken.push({token:token});

            newUser.save((err) => {
                if (err) { return done(err) }
                return done(null, newUser);
            })
        }
    })
}))
