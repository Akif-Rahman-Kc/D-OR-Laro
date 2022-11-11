const express = require('express');
const router = express.Router();
const userController = require('../controller/userContorller')
const userAuth = require('../middleware/auth')

router.get('/', userController.userHome);
router.get('/shops', userController.userShops);
router.get('/shops/details', userController.userDetails);
router.get('/cart', userAuth.sessionUser,userController.userCart);
router.post('/add_to_cart', userController.addCart);
router.post('/add_to_wishlist', userController.addWishlist);
router.post('/cart_quantity', userController.cartQuantity);
router.post('/cart/delete', userController.deleteCart);
router.post('/wishlist/delete', userController.deleteWishlist);
router.get('/checkout', userAuth.sessionUser,userController.Checkout);
router.post('/user_order', userAuth.sessionUser,userController.userOrdering);
router.get('/wishlist', userAuth.sessionUser,userController.userWishlist);
router.get('/orders', userAuth.sessionUser,userController.userOrders);
router.get('/user_profile', userAuth.sessionUser,userController.userProfile);
router.get('/user_address', userAuth.sessionUser,userController.userAddress);
router.post('/user_address', userAuth.sessionUser,userController.userAddressPost);

router.get('/user_login', userController.userLogin)
router.post('/user_login', userController.userLoginPost)

router.get('/user_registration',userController.userRegister)
router.post('/user_registration', userController.userRegisterPost)

router.get('/user_logout', userController.userLogout)

router.get('/otp', userController.OTP)

module.exports = router;