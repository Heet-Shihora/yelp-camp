const User = require('../models/user')


module.exports.renderRegister = (req, res) => {
    res.render('user/register')
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser)
        req.login(registeredUser, (e) => {
            if (e) {
                return next(e);
            }
            else {
                req.flash('success', 'Welcome to YelpCamp');
                res.redirect('/campgrounds');
            }
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');

    }
};

module.exports.renderLogin= (req, res) => {
    res.render('user/login')
};

module.exports.login=(req, res) => {
    req.flash('success', 'Welcome to YelpCamp');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    // res.redirect('/campgrounds');
};

module.exports.logout= (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};

