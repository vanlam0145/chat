const { check, validationResult } = require('express-validator');
module.exports = function () {
    return {
        checkdataSingup: [
            check('username', 'Username is required').not().isEmpty(),
            check('username', 'Username must not be less than 4').isLength({ min: 4 }),
            check('email', 'Email is required').not().isEmpty(),
            check('email', 'It not is email').isEmail(),
            check('password', 'password is required').not().isEmpty(),
            check('password', 'password must not be less than 3').isLength({ min: 3 })
        ],
        checkdataSingin: [
            check('email', 'Email is required').not().isEmpty(),
            check('email', 'It not is email').isEmail(),
            check('password', 'Password is required').not().isEmpty(),
            check('password', 'Password must not be less than 3').isLength({ min: 3 })
        ],
        showErrorsData: (req, res, next) => {
            try {
                const errors = validationResult(req).throw();//if error advent jump to catch
                return next();
            } catch (error) {
                const errors = validationResult(req);
                const messages = [];
                if (!errors.isEmpty()) {
                    errors.array().forEach(element => {
                        messages.push(element.msg);
                    });
                    req.flash('error', messages);
                    if (Object.keys(req.body).length >= 3)//but input for signup is 3 (username,email,pass);
                        res.redirect('/signup');
                    else
                        res.redirect('/');
                }
            }
        }
    }
}