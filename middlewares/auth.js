const asyncHandler = require('express-async-handler');

const User = require('../models/user');

module.exports = asyncHandler(async function auth(req, res, next) {
    const { userId } = req.session;
    res.locals.currentUser = null;
    res.locals.permission = null;
    if (userId) {
        const user = await User.findById(userId)
        if (user) {
            req.currentUser = user;
            res.locals.currentUser = user;
            req.permission = user.permission;
            res.locals.permission = user.permission;
        }
        next();
    } else {
        next();
    }
});