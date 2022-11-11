const User = require('../models/userSchema');

module.exports = {
    sessionUser: async (req, res, next) => {
        try {
            const session = req.session.userLogged
            if (session) {
                let cartCount = 0;
                let wishlistCount = 0;
                const userId = req.session.user
                const user = await User.findById(userId)
                res.locals.user = user
                if (user) {
                    cartCount = user.Cart.length
                    wishlistCount = user.Wishlist.length
                }
                res.locals.cartCount = cartCount
                res.locals.wishlistCount = wishlistCount
                const banned = user.isBanned
                if (banned == true) {
                    req.session.userLogged = false
                    res.redirect('/')
                } else {
                    next()
                }
            } else {
                res.redirect('/user_login')
            }
        } catch (error) {
            console.log(error.message);
        }

    },
    sessionAdmin: (req, res, next) => {
        try {
            const session = req.session.adminLogged
        if (session) {
            next()
        } else {
            res.redirect('/admin_panel/admin_login')
        }
        } catch (error) {
            console.log(error.message);
        }
        
    },
}