const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Category = require("../models/categorySchema");
const Order = require("../models/orderSchema");
const bcrypt = require('bcrypt');
const { findById } = require('../models/adminSchema');
const mongoose = require('mongoose')
module.exports = {
    userHome: async (req, res) => {
        try {
            const Userid = req.session.user
            const user = await User.findById(Userid)
            if (user) {
                const ban = user.isBanned
                let cartCount = 0;
                let wishlistCount = 0;
                let alerts = false
                if (ban) {
                    alerts = true
                    res.locals.alerts = alerts
                    req.session.userLogged = false
                    req.session.user = null
                } else {
                    res.locals.user = user
                    cartCount = user.Cart.length
                    wishlistCount = user.Wishlist.length
                    res.locals.cartCount = cartCount
                    res.locals.wishlistCount = wishlistCount
                }
            }
            const products = await Product.find()
            const categories = await Category.find()
            res.render('user/index', { products, categories })
        } catch (error) {
            console.log(error.message);
        }
    },
    userDetails: async (req, res) => {
        try {
            const Userid = req.session.user
            const user = await User.findById(Userid)
            if (user) {
                let cartCount = 0;
                let wishlistCount = 0;
                const ban = user.isBanned
                if (ban) {
                    res.redirect('/')
                } else {
                    res.locals.user = user
                    cartCount = user.Cart.length
                    wishlistCount = user.Wishlist.length
                    res.locals.cartCount = cartCount
                    res.locals.wishlistCount = wishlistCount
                }
            }
            const proId = req.query
            console.log(proId);
            const product = await Product.findById(proId)
            console.log(product);
            res.render('user/details', { product })
        } catch (error) {
            console.log(error.message);
        }
    },
    userShops: async (req, res) => {
        try {
            const Userid = req.session.user
            const user = await User.findById(Userid)
            if (user) {
                let cartCount = 0;
                let wishlistCount = 0;
                const ban = user.isBanned
                if (ban) {
                    res.redirect('/')
                } else {
                    res.locals.user = user
                    cartCount = user.Cart.length
                    wishlistCount = user.Wishlist.length
                    res.locals.cartCount = cartCount
                    res.locals.wishlistCount = wishlistCount
                }
            }
            const products = await Product.find()
            res.render('user/shop', { products })
        } catch (error) {
            console.log(error.message);
        }
    },
    userCart: async (req, res) => {
        try {
            const userId = req.session.user
            const user = await User.findById(userId)
            let empty = null
            if (user.Cart == '') {
                totalAmount = 0
                empty = 'cart is Empty'
            } else {
                const total = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(userId)
                        },
                    },
                    {
                        $unwind: {
                            path: '$Cart'
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] } },
                            discount: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] } },
                        },
                    },
                ])
                totalAmount = total[0].total
                discountPrice = total[0].discount
                const totalLast = totalAmount - discountPrice
                res.locals.totalLast = totalLast
            }

            res.render('user/cart', { totalAmount, discountPrice , empty })
        } catch (error) {
            console.log(error.message);
        }
    },
    addCart: async (req, res) => {
        try {
            const proId = req.body._id
            const details = req.body
            const _id = proId+details.PColor+details.PSize
            const Quantity = parseInt(req.body.quantity)
            const product = await Product.findById(proId)
            const userId = req.session.user
            const user = await User.findById(userId)
            if (user) {
                let cartbody = user.Cart
                cartbody = cartbody.map((el) => {
                    if (el.item_id == _id && el.PColor == details.PColor && el.PSize == details.PSize) {
                        return el
                    }
                })

                let modifiedCart = []
                for (let i = 0; i < cartbody.length; i++) {
                    if (cartbody[i] != undefined) {
                        modifiedCart.push(cartbody[i])
                    }
                }

                if (modifiedCart.length == 0) {
                    await User.updateOne({ _id: userId }, {
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
                                quantity: Quantity
                            }
                        }
                    })
                    res.json({ cart: true })
                } else {
                    res.json({ exist: true, })
                }
            } else {
                res.json({ cart: false })
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    cartQuantity: async (req, res) => {
        try {
            const { _id, count, quantity, Price } = req.body
            console.log(_id,count,quantity);
            let cartCount = parseInt(count)
            let cartQuantity = parseInt(quantity)
            if (cartCount == -1 && cartQuantity == 1) {
                res.json(false)
            } else {
                const userId = req.session.user
                const user = await User.findById(userId)
                await User.updateOne({ _id:userId,'Cart.item_id': _id }, {
                    $inc: {
                        'Cart.$.quantity': cartCount
                    }
                })

                const total = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(userId)
                        },
                    },
                    {
                        $unwind: {
                            path: '$Cart'
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] } },
                            discount: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] } },
                        },
                    },
                ])
                // const pprice = parseInt(Price)
                // if (cartCount == 1) {
                //     cartQuantity = cartQuantity + 1;
                // } else {
                //     cartQuantity = cartQuantity - 1;
                // }
                // const subTotal = cartQuantity * pprice;
                // console.log(subTotal);
                totalAmount = total[0].total
                discountPrice = total[0].discount
                const totalLast = totalAmount - discountPrice
                res.json({totalAmount,totalLast,discountPrice})
            }
        } catch (error) {
            console.log(error.message);
        }

    },
    deleteCart: async (req, res) => {
        try {
            const { _id} = req.body
            const userId = req.session.user
                await User.updateOne({_id: userId }, {
                    $pull: { Cart: {item_id:_id} }
                })
                res.json(true)
            
        } catch (error) {
            console.log(error.message);
        }
    },
    Checkout: async (req, res) => {
        try {
            const userId = req.session.user
            const user = await User.findById(userId)
            const total = await User.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(userId)
                    },
                },
                {
                    $unwind: {
                        path: '$Cart'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] } },
                        discount: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] } },
                    },
                },
            ])
            const totalAmount = total[0].total
            discountPrice = total[0].discount
            const totalLast = totalAmount - discountPrice
            res.render('user/checkout', { totalAmount,discountPrice,totalLast })
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddress: async (req, res) => {
        try {
            const userId = req.session.user
            const user = await User.findById(userId)
            res.render('user/address')
        } catch (error) {
            console.log(error.message);
        }
    },
    userAddressPost: async (req, res) => {
        try {
            const address = req.body
            const userId = req.session.user
            await User.updateOne({ _id: userId }, {
                $push: { Address: address }
            })
            const user = await User.findById(userId)
            const Address = user.Address
            console.log(Address);
            res.render('user/checkout', { Address })
        } catch (error) {
            console.log(error.message);
        }
    },
    userOrdering: async (req, res) => {
        try {
            const order = req.body
            const userId = req.session.user
            const user = await User.findById(userId)
            const total = await User.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(userId)
                    },
                },
                {
                    $unwind: {
                        path: '$Cart'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PPrice"] } },
                        discount: { $sum: { $multiply: ["$Cart.quantity", "$Cart.PDiscount"] } },
                    },
                },
            ])
            const totalAmount = total[0].total
            discountPrice = total[0].discount
            const totalLast = totalAmount - discountPrice
            const status = order.payment === 'Cash on Delivery' ? 'Placed' : 'Pending'
            const userOrder = {
                Address: {
                    fName: order.firstName,
                    lName: order.lastName,
                    mobileNo: order.mobileNo,
                    address: order.address,
                    city: order.city,
                    locality: order.locality,
                    landmark: order.landmark,
                    pinCode: order.pinCode
                },
                userId: userId,
                paymentMethod: order.payment,
                orderStatus: status,
                totalAmount: totalAmount,
                discountPrice:discountPrice,
                totalLast:totalLast,
                orderDate: new Date()
            }
            await Order.create(userOrder)
            const aa = await User.updateOne({ _id: userId }, {
                $set: {
                    Cart: []
                },
            })
            cartCount = 0
            res.locals.cartCount = cartCount
            res.render('user/order-success', { userOrder, user })
        } catch (error) {
            console.log(error.message);
        }
    },
    userOrders: async (req, res) => {
        try {
            const order = await Order.find()
            const userId = req.session.user
            const user = await User.findById(userId)
            res.render('user/order', { order, user })
        } catch (error) {
            console.log(error.message);
        }
    },
    userWishlist: async (req, res) => {
        try {
            const userId = req.session.user
            const user = await User.findById(userId)
            let empty = null
            if (user.Wishlist == '') {
                empty = 'Wishlist is empty'
            }
            res.render('user/wishlist', { user, empty })
        } catch (error) {
            console.log(error.message);
        }
    },
    addWishlist: async (req, res) => {
        try {
            const _id = req.body._id
            const product = await Product.findById(_id)
            const userId = req.session.user
            const user = await User.findById(userId)
            if (user) {
                const wishlistExist = user.Wishlist.findIndex(wishlistPro => wishlistPro.item_id == _id)
                if (wishlistExist != -1) {
                    res.json({ exist: true })
                } else {
                    await User.updateOne({ _id: userId }, {
                        $push: {
                            Wishlist: {
                                item_id: _id,
                                PName: product.PName,
                                PDes: product.PDes,
                                PPrice: product.PPrice,
                                POldPrice: product.POldPrice,
                                PImage: product.PImage[0]
                            }
                        }
                    })
                    res.json({ wishlist: true })
                }
            } else {
                res.json({ wishlist: false })
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteWishlist: async (req, res) => {
        try {
            const { _id } = req.body
            await User.updateOne({ 'Wishlist.item_id': _id }, {
                $pull: { Wishlist: { item_id: _id } }
            })
            res.json(true)
        } catch (error) {
            console.log(error.message);
        }
    },
    userProfile: async (req, res) => {
        try {
            const userId = req.session.user
            const user = await User.findById(userId)
            res.render('user/profile', { user })
        } catch (error) {
            console.log(error.message);
        }
    },
    userLogin: (req, res) => {
        try {
            if (req.session.userLogged) {
                res.redirect('/')
            } else {
                res.render('user/login')
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userLoginPost: async (req, res) => {
        try {
            const userData = req.body
            const email = await User.findOne({ userEmail: userData.userEmail })
            if (email) {
                const pass = await bcrypt.compare(userData.userPass, email.userPass)
                if (pass) {
                    req.session.userLogged = true
                    req.session.user = email._id
                    res.redirect('/')
                } else {
                    res.render('user/login', { errorPass: 'This Password is Incorrect !' })
                }
            } else {
                res.render('user/login', { errorEmail: 'This Email is Incorrect !' })
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userRegister: (req, res) => {
        try {
            if (req.session.userLogged) {
                res.redirect('/')
            } else {
                res.render('user/register')``
            }
        } catch (error) {
            console.log(error);
        }
    },
    userRegisterPost: async (req, res) => {
        try {
            const EmailorPhone = req.body.userEmail;

            const oldUser = await User.findOne({ userEmail: EmailorPhone })
            if (oldUser) {
                res.render('user/register', { errorMeassage: 'This email already existed !' })
            }
            else {
                try {
                    const userDetails = req.body
                    if (userDetails.userPass === userDetails.userConfPass) {
                        userDetails.userPass = await bcrypt.hash(userDetails.userPass, 10)
                        const user = await User.create(userDetails);
                        req.session.userLogged = true
                        req.session.user = user._id
                        res.redirect('/')
                    } else {
                        res.render('user/register', { errorPassword: 'Do not match the password !' })
                    }

                } catch (error) {
                    console.log(error.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    userLogout: (req, res) => {
        try {
            req.session.userLogged = false
            req.session.user = null
            res.redirect('/user_login')
        } catch (error) {
            console.log(error.message);
        }
    },
    OTP: (req, res) => {
        try {
            res.render('user/otp')
        } catch (error) {
            console.log(error.message);
        }
    },
}
