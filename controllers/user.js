const User = require('../models/user');

module.exports.renderUser = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Yelp Camp ${req.user.username}`);
            res.redirect('/campground')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.loginUsers = (req, res) => {
    req.flash('success', `Welcome Back ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "GOODBYE!!");
    res.redirect('/campground');
}