const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys');
const FacebookStategy = require('passport-facebook').Strategy;
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});
passport.use(new FacebookStategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: ['email', 'displayName','photos'],
    callbackURL: keys.facebook.deploy(),
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    console.log("FACEBOOK: ", profile);
    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }
        else {
            const newUser=new User();
            newUser.facebook=profile.id;
            newUser.fullname=profile.displayName;
            newUser.username=profile.displayName;
            newUser.email=profile._json.email;
            newUser.userImage=profile.photos[0].value;
            //newUser.fbToken =[];
            //newUser.fbToken.push({token:token});
            
            newUser.save((err)=>{
                return done(null,newUser);
            })
        }
    })
}))
