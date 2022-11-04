const withAuth = (req, res, next) => {
    if (!req.session.logged_in) {
        res.redirected('/login');
    } else {
        next();
    };
};

module.exports = withAuth;