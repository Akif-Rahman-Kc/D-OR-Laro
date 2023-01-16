const express = require('express');
const router = express.Router();
const userController = require('../controller/userContorller')
const userAuth = require('../middleware/auth')


// 404

router.get('/404', userController.user404)

// Authentication

router.get('/user_registration', userController.userRegister)
router.post('/user_registration', userController.userRegisterPost)

router.get('/user_login', userController.userLogin)
router.post('/user_login', userController.userLoginPost)
router.get('/user_login/forgot_password', userController.forgotPass)
router.post('/user_login/forgot_password', userController.forgotPassPost)

router.get('/user_logout', userController.userLogout)

router.get('/otp', userController.OTP)
router.post('/verify_otp', userController.verifyOtp)

// Landing Page

router.get('/', userController.userHome);
router.get('/shops', userController.userShops);
router.get('/shops/filter_category', userController.filterCategory);
router.post('/shops/filter_sub_category', userController.filtering);
router.get('/shops/details', userController.userDetails);
router.post('/reviews', userController.userReviews);
router.post('/search', userController.userSearch);

//Contact

router.get('/contact', userController.contact);

// Cart

router.get('/cart', userAuth.sessionUser,userController.userCart);
router.post('/add_to_cart', userController.addCart);
router.post('/cart_plus', userController.cartPlus);
router.post('/cart_minus', userController.cartMinus);
router.post('/cart/delete', userController.deleteCart);

// Coupon

router.get('/coupons', userAuth.sessionUser,userController.userCoupon);
router.post('/coupon_verify', userController.couponVerify);

// Wishlist

router.get('/wishlist', userAuth.sessionUser,userController.userWishlist);
router.post('/add_to_wishlist', userController.addWishlist);
router.post('/wishlist/delete', userController.deleteWishlist);

// Ordering

router.get('/checkout', userAuth.sessionUser,userController.Checkout);
router.post('/checkout_address/add', userAuth.sessionUser,userController.checkoutAddressAdd);

router.post('/user_order', userController.userOrdering);
router.post('/verify_payment', userController.verifyPayment);
router.get('/order_success',userAuth.sessionUser, userController.orderSuccess);
router.get('/orders', userAuth.sessionUser,userController.userOrders);
router.get('/order_cancelled', userAuth.sessionUser,userController.orderCancel);

// User Details

router.get('/user_profile', userAuth.sessionUser,userController.userProfile);
router.post('/user_profile_edit', userAuth.sessionUser,userController.userProfileEdit);
router.get('/user_address', userAuth.sessionUser,userController.userAddress);
router.post('/user_address/add', userAuth.sessionUser,userController.userAddressAdd);
router.post('/user_address/edit', userAuth.sessionUser,userController.userAddressEdit);
router.get('/user_address/delete', userAuth.sessionUser,userController.userAddressDelete);



module.exports = router;