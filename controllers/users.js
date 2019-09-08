'use strict';
module.exports = function (_, passport, User) {
    return {
        SetRouting: function (router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignup);
            
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.GoogleLogin);

            router.post('/', User.checkdataSingin, User.showErrorsData, this.postSignin);
            router.post('/signup', User.checkdataSingup, User.showErrorsData, this.postSignup);
        },
        indexPage: function (req, res) {
            const errors = req.flash('error')
            return res.render('index', { title: 'chat test', messages: errors, hasErrors: errors.length > 0 });
        },

        getSignup: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: 'chat test', messages: errors, hasErrors: errors.length > 0 });
        },
        getFacebookLogin: passport.authenticate('facebook', {
            scope: ['email']
        }),
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getGoogleLogin: passport.authenticate('google', {
            scope: [ 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile']
        }), 
        GoogleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        
        postSignup: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        postSignin: passport.authenticate('local.signin', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        
    }
}