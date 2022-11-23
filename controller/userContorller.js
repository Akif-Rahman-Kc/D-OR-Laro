const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const OTP = require('twilio')
const moment = require('moment')
const otpCheck = require('../middleware/otp')
const bcrypt = require("bcrypt");
const { findById, startSession } = require("../models/adminSchema");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

let instance = new Razorpay({
    key_id: "rzp_test_1Pl9Fu2TCeC5Vk",
    key_secret: "gQfRHBdrRYnUPRIDZEhXOUdm",
});

module.exports = {
    userRegister: (req, res) => {
        try {
            if (req.session.userLogged) {
                res.redirect("/");
            } else {
                res.render("user/register")``;
            }
        } catch (error) {
            console.log(error);
        }
    },
    userRegisterPost: async (req, res) => {
        try {
            const EmailorPhone = req.body.userEmail;

            const oldUser = await User.findOne({ userEmail: EmailorPhone });
            if (oldUser) {
                res.render("user/register", {
                    errorMeassage: "This email already existed !",
                });
            } else {
                try {
                    const userDetails = req.body;
                    if (userDetails.userPass === userDetails.userConfPass) {
                        req.session.userDetails = userDetails
                        const number = parseInt(userDetails.userPhoneNo)
                        console.log(number);
                        otpCheck.otpSend(number)
                        res.redirect('/otp')
                    } else {
                        res.render("user/register", {
                            errorPassword: "Do not match the password !",
                        });
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userLogin: (req, res) => {
        try {
            if (req.session.userLogged) {
                res.redirect("/");
            } else {
                res.render("user/login");
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userLoginPost: async (req, res) => {
        try {
            const userData = req.body;
            const email = await User.findOne({ userEmail: userData.userEmail });
            if (email) {
                const pass = await bcrypt.compare(userData.userPass, email.userPass);
                if (pass) {
                    req.session.userLogged = true;
                    req.session.user = email._id;
                    res.redirect("/");
                } else {
                    res.render("user/login", {
                        errorPass: "This Password is Incorrect !",
                    });
                }
            } else {
                res.render("user/login", { errorEmail: "This Email is Incorrect !" });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    forgotPass: (req, res) => {
        try {
            res.render("user/forgot");
        } catch (error) {
            console.log(error.message);
        }
    },
    forgotPassPost: async (req, res) => {
        try {
            const newPass = req.body;
            console.log(newPass);
            const oldUser = await User.findOne({ userEmail: newPass.userEmail });
            if (oldUser) {
                if (newPass.userPass === newPass.userConfPass) {
                    newPass.userPass = await bcrypt.hash(newPass.userPass, 10);
                    await User.updateOne(
                        { userEmail: newPass.userEmail },
                        {
                            $set: {
                                userPass: newPass.userPass,
                            },
                        }
                    );
                    res.render("user/login", { success: "error" });
                } else {
                    res.render("user/forgot", {
                        errorPassword: "Do not match the password !",
                    });
                }
            } else {
                res.render("user/forgot", {
                    errorEmail: "This Email not registered !",
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userLogout: (req, res) => {
        try {
            req.session.userLogged = false;
            req.session.user = null;
            res.redirect("/user_login");
        } catch (error) {
            console.log(error.message);
        }
    },
    OTP: (req, res) => {
        try {
            res.render("user/otp");
        } catch (error) {
            console.log(error.message);
        }
    },
    verifyOtp: async (req, res) => {
        try {
            console.log(req.body)
            let otp = Object.values(req.body)
            otp = otp.join()
            otp = otp.split(",").join('')
            console.log(otp);
            const userDetails = req.session.userDetails
            const number = parseInt(userDetails.userPhoneNo)
            let otpStatus = await otpCheck.otpVerify(number, otp)
            if (otpStatus.valid) {
                userDetails.userPass = await bcrypt.hash(userDetails.userPass, 10);
                const user = await User.create(userDetails);
                req.session.userLogged = true;
                req.session.user = user._id;
                res.redirect('/')
            } else {
                res.render("user/otp", { otpErr: "Incorrect OTP" });
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    userHome: async (req, res) => {
        try {
            const Userid = req.session.user;
            let user = await User.findById(Userid);
            let products;
            if (user) {
                const ban = user.isBanned;
                let cartCount = 0;
                let wishlistCount = 0;
                let alerts = false;
                if (ban) {
                    alerts = true;
                    res.locals.alerts = alerts;
                    req.session.userLogged = false;
                    req.session.user = null;
                } else {
                    cartCount = user.Cart.length;
                    wishlistCount = user.Wishlist.length;
                    res.locals.cartCount = cartCount;
                    res.locals.wishlistCount = wishlistCount;
                    products = await Product.find()
                        .lean()
                        .sort({ createdAt: -1 })
                        .limit(24);

                    for (let i = 0; i < products.length; i++) {
                        for (let j = 0; j < user.Wishlist.length; j++) {
                            if (user.Wishlist[j].item_id == products[i]._id) {
                                products[i].fav = true;
                            }
                        }
                    }
                    res.locals.user = user;
                }
            } else {
                products = await Product.find().sort({ createdAt: -1 }).limit(24);
            }
            const categories = await Category.find();

            res.render("user/index", { products, categories });
        } catch (error) {
            console.log(error.message);
        }
    },
    userShops: async (req, res) => {
        try {
            const Userid = req.session.user;
            const user = await User.findById(Userid);
            let products;
            if (user) {
                let cartCount = 0;
                let wishlistCount = 0;
                const ban = user.isBanned;
                if (ban) {
                    res.redirect("/");
                } else {
                    cartCount = user.Cart.length;
                    wishlistCount = user.Wishlist.length;
                    res.locals.cartCount = cartCount;
                    res.locals.wishlistCount = wishlistCount;
                    products = await Product.find().lean().sort({ createdAt: -1 });

                    for (let i = 0; i < products.length; i++) {
                        for (let j = 0; j < user.Wishlist.length; j++) {
                            if (user.Wishlist[j].item_id == products[i]._id) {
                                products[i].fav = true;
                            }
                        }
                    }
                    res.locals.user = user;
                }
            } else {
                products = await Product.find().sort({ createdAt: -1 });
            }
            const categories = await Category.find();
            const subCat = await Category.find();
            let subCatNull = true;
            res.locals.subCatNull = subCatNull;
            res.render("user/shop", { products, categories, subCat });
        } catch (error) {
            console.log(error.message);
        }
    },
    filterCategory: async (req, res) => {
        try {
            const Userid = req.session.user;
            const user = await User.findById(Userid);
            if (user) {
                let cartCount = 0;
                let wishlistCount = 0;
                const ban = user.isBanned;
                if (ban) {
                    res.redirect("/");
                } else {
                    res.locals.user = user;
                    cartCount = user.Cart.length;
                    wishlistCount = user.Wishlist.length;
                    res.locals.cartCount = cartCount;
                    res.locals.wishlistCount = wishlistCount;
                }
            }
            const { catName } = req.query;
            const products = await Product.find({ PCategory: catName });
            const subCat = await Category.findOne({ Category: catName });
            const categories = await Category.find();
            res.render("user/shop", { products, categories, subCat });
        } catch (error) {
            console.log(error.message);
        }
    },
    filtering: async (req, res) => {
        try {
            const categories = await Category.find();
            const subCat = await Category.find();
            let subCatNull = true;
            res.locals.subCatNull = subCatNull;
            const data = req.body;
            console.log(data);
            let products = await Product.find();
            if (data.subCategory) {
                if (Array.isArray(data.subCategory)) {
                    products = products.filter((obj) => {
                        if (data.subCategory.includes(obj.PSubCategory)) {
                            return obj;
                        }
                    });
                } else {
                    products = products.filter((obj) => {
                        if (data.subCategory === obj.PSubCategory) {
                            return obj;
                        }
                    });
                }
            }
            if (data.brand) {
                if (Array.isArray(data.brand)) {
                    products = products.filter((obj) => {
                        if (data.brand.includes(obj.PBrand)) {
                            return obj;
                        }
                    });
                } else {
                    products = products.filter((obj) => {
                        if (data.brand === obj.PBrand) {
                            return obj;
                        }
                    });
                }
            }
            console.log(products);
            if (products != "") {
                res.locals.products = products;
            }
            res.render("user/shop", { categories, subCat });
        } catch (error) {
            console.log(error.message);
        }
    },
    userDetails: async (req, res) => {
        try {
            const Userid = req.session.user;
            const user = await User.findById(Userid);
            if (user) {
                let cartCount = 0;
                let wishlistCount = 0;
                const ban = user.isBanned;
                if (ban) {
                    res.redirect("/");
                } else {
                    res.locals.user = user;
                    cartCount = user.Cart.length;
                    wishlistCount = user.Wishlist.length;
                    res.locals.cartCount = cartCount;
                    res.locals.wishlistCount = wishlistCount;
                }
            }
            const proId = req.query;
            console.log(proId);
            const product = await Product.findById(proId);
            console.log(product);
            res.render("user/details", { product });
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    userCart: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            let empty = null;
            if (user.Cart == "") {
                empty = "cart is Empty";
            } else {
                if(user.applyCoupon){
                    res.locals.applyCoupon = true

                    const usedCouponlen = user.usedCoupon.length -1
                    const usedCoupon = user.usedCoupon[usedCouponlen]
                    res.locals.usedCoupon = usedCoupon

                    const totalAmount = user.cartTotals.subTotal
                    const discountPrice = user.cartTotals.discount
                    const couponDiscount = user.cartTotals.couponDiscount
                    const totalLast = user.cartTotals.total
                    
                    res.locals.totalLast = totalLast;
                    res.locals.discountPrice = discountPrice
                    res.locals.totalAmount = totalAmount
                    res.locals.couponDiscount = couponDiscount
                }else{
                    const total = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(userId),
                        },
                    },
                    {
                        $unwind: {
                            path: "$Cart",
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] },
                            },
                            discount: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] },
                            },
                        },
                    },
                ]);
                totalAmount = total[0].total;
                discountPrice = total[0].discount;
                const couponDiscount = 0;
                const totalLast = totalAmount - discountPrice - couponDiscount;
                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            cartTotals: {
                                subTotal: totalAmount,
                                discount: discountPrice,
                                couponDiscount:couponDiscount,
                                total: totalLast
                            }
                        },
                    }
                );
                res.locals.totalLast = totalLast;
                res.locals.discountPrice = discountPrice
                res.locals.totalAmount = totalAmount
                res.locals.couponDiscount = couponDiscount
                }
                
            }
            
            res.render("user/cart", { empty ,user });
        } catch (error) {
            console.log(error.message);
        }
    },
    addCart: async (req, res) => {
        try {
            const proId = req.body._id;
            const details = req.body;
            const _id = proId + details.PColor + details.PSize;
            const Quantity = parseInt(req.body.quantity);
            const product = await Product.findById(proId);
            const userId = req.session.user;
            const user = await User.findById(userId);
            if (user) {
                if (user.applyCoupon) {
                    res.json({ applyCoupon: true });
                } else {
                    let cartbody = user.Cart;
                cartbody = cartbody.map((el) => {
                    if (
                        el.item_id == _id &&
                        el.PColor == details.PColor &&
                        el.PSize == details.PSize
                    ) {
                        return el;
                    }
                });

                let modifiedCart = [];
                for (let i = 0; i < cartbody.length; i++) {
                    if (cartbody[i] != undefined) {
                        modifiedCart.push(cartbody[i]);
                    }
                }

                if (modifiedCart.length == 0) {
                    await User.updateOne(
                        { _id: userId },
                        {
                            $push: {
                                Cart: {
                                    item_id: _id,
                                    PName: product.PName,
                                    PCategory: product.PCategory,
                                    PSubCategory: product.PSubCategory,
                                    PPrice: product.PPrice,
                                    PImage: product.PImage,
                                    PBrand: product.PBrand,
                                    PStock: product.PStock,
                                    PDiscount: product.PDiscount,
                                    PSize: details.PSize,
                                    PColor: details.PColor,
                                    quantity: Quantity,
                                },
                            },
                        }
                    );
                    res.json({ cart: true });
                } else {
                    res.json({ exist: true });
                }
                }
                
            } else {
                res.json({ cart: false });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    cartQuantity: async (req, res) => {
        try {
            const { _id, count, quantity, Price } = req.body;
            console.log(_id, count, quantity);
            let cartCount = parseInt(count);
            let cartQuantity = parseInt(quantity);
            if (cartCount == -1 && cartQuantity == 1) {
                res.json(false);
            } else {
                const userId = req.session.user;
                const user = await User.findById(userId);
                await User.updateOne(
                    { _id: userId, "Cart.item_id": _id },
                    {
                        $inc: {
                            "Cart.$.quantity": cartCount,
                        },
                    }
                );
                const total = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(userId),
                        },
                    },
                    {
                        $unwind: {
                            path: "$Cart",
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] },
                            },
                            discount: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] },
                            },
                        },
                    },
                ]);
                totalAmount = total[0].total;
                discountPrice = total[0].discount;
                const totalLast = totalAmount - discountPrice;
                const couponDiscount = 0
                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            cartTotals: {
                                subTotal: totalAmount,
                                discount: discountPrice,
                                couponDiscount:0,
                                total: totalLast
                            }
                        },
                    }
                );
                res.json({ totalAmount, totalLast, discountPrice , couponDiscount });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteCart: async (req, res) => {
        try {
            const { _id } = req.body;
            const userId = req.session.user;
            const user = await User.findById(userId)
            const aa = await User.updateOne(
                { _id: userId },
                {
                    $pull: { Cart: { item_id: _id } },
                }
            )
            if (user.Cart.length == 1) {
                console.log("cart illa");
                res.json(false)
            } else {
                const total = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(userId),
                        },
                    },
                    {
                        $unwind: {
                            path: "$Cart",
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] },
                            },
                            discount: {
                                $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] },
                            },
                        },
                    },
                ]);
                totalAmount = total[0].total;
                discountPrice = total[0].discount;
                const totalLast = totalAmount - discountPrice;
                const couponDiscount = user.cartTotals.couponDiscount;
                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            cartTotals: {
                                subTotal: totalAmount,
                                discount: discountPrice,
                                couponDiscount:couponDiscount,
                                total: totalLast
                            }
                        },
                    }
                );
                res.json({ totalAmount, discountPrice, totalLast ,couponDiscount });
            }

        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    userCoupon: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            let coupon = await Coupon.find()
           usedCouponId = user.usedCoupon.map(el=> el.couponId.toString())
           console.log(usedCouponId);
           coupon = coupon.filter(el=> !usedCouponId.includes(el._id.toString()))
           
           for (let i = 0; i < coupon.length; i++) {
            const testDate = coupon[i].expiryDate
            coupon[i].date = moment(testDate).format('DD/MM/YYYY')
           }
            
            let empty = null;
            if (user.Coupon == "") {
                empty = "Coupon is empty";
            }
            res.render("user/coupon", { coupon, empty });
        } catch (error) {
            console.log(error.message);
        }
    },
    couponVerify: async (req, res) => {
        try {
            let userId = req.session.user
            const user = await User.findById(userId)
            console.log(req.body);
            const { CouponCode, amountTotal } = req.body
            let total = parseInt(amountTotal)
            let coupon = await Coupon.findOne({ couponCode: CouponCode })
            let date = new Date()
            console.log(CouponCode, total);
            if (user.applyCoupon) {
                await User.updateOne({_id:userId} ,{
                        $set:{
                            applyCoupon:false
                        }
                    })
                await User.updateOne({_id:userId} ,{
                        $pull:{
                            usedCoupon:{
                                _id:coupon._id,
                                code:coupon.couponCode,
                            }
                        }
                    })
                    res.json({removeCoupon:true})
            } else {
                if(CouponCode == ''){
                    res.json(false)
                }else{
                    const existCoupon = await User.findOne({'usedCoupon._id':coupon._id})
                console.log(existCoupon);
                if (existCoupon) {
                    res.json({exist:true})
                } else {
                    if (coupon) {
                    let percentage = coupon.percentage
                    console.log(coupon.expiryDate);
                    if (coupon.startDate <= date <= coupon.expiryDate) {
                        console.log(total, coupon.minCartAmount);
                        if (coupon.minCartAmount <= total) {
                            discount = (total * percentage) / 100
                            if (coupon.maxRadeemAmount >= discount) {
                                let totalLast = total - discount
                                await User.updateOne(
                                    { _id: userId },
                                    {
                                        $set: {
                                            cartTotals: {
                                                subTotal: user.cartTotals.subTotal,
                                                discount: user.cartTotals.discount,
                                                couponDiscount:percentage,
                                                total: totalLast
                                            }
                                        },
                                    }
                                );
                                await User.updateOne({_id:userId} ,{
                                        $set:{
                                            applyCoupon:true
                                        }
                                })
                                await User.updateOne({_id:userId} ,{
                                    $push:{
                                        usedCoupon:{
                                            couponId:coupon._id,
                                            code:coupon.couponCode,
                                        }
                                    }
                                })
                                res.json({ success: true })
                            } else {
                                res.json({ maxRadeem: coupon.maxRadeemAmount })
                            }
                        } else {
                            res.json({ minCart: coupon.minCartAmount })
                        }
                    } else {
                        res.json({ expired: true })
                    }
                } else {
                    res.json({ invalid: true })
                }
                }
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    },


    /////////////////////////////////////////////////////////////////////////

    Checkout: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            let addressNull = null;
            if (user.Cart == "") {
                res.redirect("/cart");
            } else {
                if (user.Address == "") {
                    addressNull = "created Address";
                }
                const totalAmount = user.cartTotals.subTotal;
                const discountPrice = user.cartTotals.discount;
                const totalLast = user.cartTotals.total;
                const couponDiscount = user.cartTotals.couponDiscount;
                res.render("user/checkout", {
                    user,
                    couponDiscount,
                    totalAmount,
                    discountPrice,
                    totalLast,
                    addressNull,
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    checkoutAddressAdd: async (req, res) => {
        try {
            const userAddress = req.body;
            const userId = req.session.user;
            await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        Address: {
                            firstName: userAddress.firstName,
                            lastName: userAddress.lastName,
                            mobileNo: userAddress.mobileNo,
                            address: userAddress.address,
                            city: userAddress.city,
                            locality: userAddress.locality,
                            landmark: userAddress.landmark,
                            pinCode: userAddress.pinCode,
                        },
                    },
                }
            );
            res.redirect("/checkout");
        } catch (error) {
            console.log(error.message);
        }
    },
    userOrdering: async (req, res) => {
        try {
            const orderBody = req.body;
            console.log(orderBody);
            const userId = req.session.user;
            const user = await User.findById(userId);
            await User.updateOne({_id:userId} ,{
                $set:{
                    applyCoupon:false
                }
            })
            const totalAmount = user.cartTotals.subTotal;
            const discountPrice = user.cartTotals.discount;
            const couponDiscount = user.cartTotals.couponDiscount;
            const totalLast = user.cartTotals.total;
            const proCount = user.Cart.length;
            const status =
                orderBody.payment === "Cash on Delivery" ? "Placed" : "Pending";
            const paymentStatus =
                orderBody.payment === "Cash on Delivery" ? "Unpaid" : "Paid";
            const id = orderBody.id;
            const codOrder = user.Address.at(id);
            let date= new Date();
            date.setDate(date.getDate() + 5);
            date = moment(date).format('DD MMMM , YYYY')
            const userOrder = {
                Address: {
                    firstName: codOrder.firstName,
                    lastName: codOrder.lastName,
                    mobileNo: codOrder.mobileNo,
                    address: codOrder.address,
                    city: codOrder.city,
                    locality: codOrder.locality,
                    landmark: codOrder.landmark,
                },
                userId: userId,
                items: user.Cart,
                paymentMethod: orderBody.payment,
                paymentStatus: paymentStatus,
                orderStatus: status,
                totalProduct: proCount,
                totalAmount: totalAmount,
                discountPrice: discountPrice,
                couponDiscount:couponDiscount,
                totalLast: totalLast,
                deliveryDate:date
            };
            const orderId = await Order.create(userOrder);

            if (orderBody.payment == "Cash on Delivery") {
                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            Cart: [],
                            cartTotals: {}
                        },
                    }
                );
                res.json({ codSuccess: true });
            } else {
                var options = {
                    amount: totalLast * 100, // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "" + orderId._id,
                };
                instance.orders.create(options, function (err, order) {
                    console.log(order);
                    res.json({ order, userOrder, user });
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    verifyPayment: async (req, res) => {
        try {
            const userId = req.session.user;
            await User.updateOne(
                { _id: userId },
                {
                    $set: {
                        Cart: [],
                        cartTotals: {}
                    },
                }
            );
            const { payment, orders } = req.body;
            let body = `${payment.razorpay_order_id}|${payment.razorpay_payment_id}`;
            const crypto = require("crypto");
            let hmac = crypto
                .createHmac("sha256", "gQfRHBdrRYnUPRIDZEhXOUdm")
                .update(body)
                .digest("hex");
            const orderId = orders.receipt;
            if (hmac == payment.razorpay_signature) {
                console.log(orderId);
                await Order.updateOne(
                    { _id: orderId },
                    {
                        $set: {
                            orderStatus: "Placed",
                        },
                    }
                );
                res.json({ status: true });
            } else {
                res.json({ status: false });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    orderSuccess: async (req, res) => {
        try {
            const userId = req.session.user;
            const userOrder = await Order.findOne({ userId: userId })
                .sort({ createdAt: -1 })
                .limit(1);
                const testDate = userOrder.createdAt
                const date = moment(testDate).format('DD MMMM , YYYY')
            res.render("user/order-success", { userOrder,date });
        } catch (error) {
            console.log(error.message);
        }
    },
    userOrders: async (req, res) => {
        try {
            const userId = req.session.user;
            const pendingOrder = await Order.find({ userId: userId }).sort({
                createdAt: -1,
            }).lean();
            let order = [];
            let orderCount = 0;
            for (let i = 0; i < pendingOrder.length; i++) {
                if (pendingOrder[i].orderStatus != "Pending") {
                    order[i] = pendingOrder[i];
                    const testDate = pendingOrder[i].createdAt
                    order[i].testDate = moment(testDate).format('DD MMMM , YYYY')
                    console.log(order[i].testDate);
                    orderCount = orderCount + 1;

                    if (order[i].orderStatus == "Placed") {
                        order[i].Placed = true
                    } else if (order[i].orderStatus == "Processed") {
                        order[i].Placed = true
                        order[i].Processed = true
                    } else if (order[i].orderStatus == "Shipped") {
                        order[i].Placed = true
                        order[i].Processed = true
                        order[i].Shipped = true
                    } else if (order[i].orderStatus == "Delivered") {
                        order[i].Placed = true
                        order[i].Processed = true
                        order[i].Shipped = true
                        order[i].Delivered = true
                    }
                }
            }

            console.log(order);
            console.log(orderCount);
            res.render("user/order", { order, orderCount });
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    userProfile: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            res.render("user/profile", { user });
        } catch (error) {
            console.log(error.message);
        }
    },
    userProfileEdit: async (req, res) => {
        try {
            console.log(req.body);
            const updateUser = req.body;
            const userId = req.session.user;
            const oldUser = await User.findOne({ userEmail: updateUser.userEmail });
            if (oldUser) {
                res.render("user/profile", {
                    Existerror: "This email already existed !",
                });
            } else {
                await User.findByIdAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            userFName: updateUser.userFName,
                            userLName: updateUser.userLName,
                            userEmail: updateUser.userEmail,
                            userPhoneNo: updateUser.userPhoneNo,
                        },
                    }
                );
                res.redirect("/user_profile");
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddress: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            let addressNull = "created Address";
            if (user.Address == "") {
                addressNull = null;
            }
            res.render("user/address", { user, addressNull });
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddressAdd: async (req, res) => {
        try {
            const userAddress = req.body;
            const userId = req.session.user;
            await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        Address: {
                            // address_id: user._id+len+userAddress.mobileNo,
                            firstName: userAddress.firstName,
                            lastName: userAddress.lastName,
                            mobileNo: userAddress.mobileNo,
                            address: userAddress.address,
                            city: userAddress.city,
                            locality: userAddress.locality,
                            landmark: userAddress.landmark,
                            pinCode: userAddress.pinCode,
                        },
                    },
                }
            );
            res.redirect("/user_address");
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddressEdit: async (req, res) => {
        try {
            const { id } = req.query;
            const userAddress = req.body;
            const userId = req.session.user;
            const user = await User.findOne({ _id: userId });
            const addressObj = {
                firstName: userAddress.firstName,
                lastName: userAddress.lastName,
                mobileNo: userAddress.mobileNo,
                address: userAddress.address,
                city: userAddress.city,
                locality: userAddress.locality,
                landmark: userAddress.landmark,
                pinCode: userAddress.pinCode,
            };
            user.Address[id] = addressObj;
            await user.save();
            res.redirect("/user_address");
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddressDelete: async (req, res) => {
        try {
            const { id } = req.query;
            const userId = req.session.user;
            const user = await User.findOne({ _id: userId });
            user.Address.splice(id, 1);
            await user.save();
            res.redirect("/user_address");
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    userWishlist: async (req, res) => {
        try {
            const userId = req.session.user;
            const user = await User.findById(userId);
            let empty = null;
            if (user.Wishlist == "") {
                empty = "Wishlist is empty";
            }
            res.render("user/wishlist", { user, empty });
        } catch (error) {
            console.log(error.message);
        }
    },
    addWishlist: async (req, res) => {
        try {
            const _id = req.body._id;
            const product = await Product.findById(_id);
            console.log(product);
            const userId = req.session.user;
            const user = await User.findById(userId);
            if (user) {
                const wishlistExist = user.Wishlist.findIndex(
                    (wishlistPro) => wishlistPro.item_id == _id
                );
                if (wishlistExist != -1) {
                    await User.updateOne(
                        { "Wishlist.item_id": _id },
                        {
                            $pull: { Wishlist: { item_id: _id } },
                        }
                    );
                    res.json({ exist: true });
                } else {
                    await User.updateOne(
                        { _id: userId },
                        {
                            $push: {
                                Wishlist: {
                                    item_id: _id,
                                    PName: product.PName,
                                    PPrice: product.PPrice,
                                    PStock: product.PStock,
                                    PImage: product.PImage[0],
                                },
                            },
                        }
                    );
                    res.json({ wishlist: true });
                }
            } else {
                res.json({ wishlist: false });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteWishlist: async (req, res) => {
        try {
            const { _id } = req.body;
            await User.updateOne(
                { "Wishlist.item_id": _id },
                {
                    $pull: { Wishlist: { item_id: _id } },
                }
            );
            res.json(true);
        } catch (error) {
            console.log(error.message);
        }
    },
};
