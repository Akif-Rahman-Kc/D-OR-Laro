const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const Coupon = require("../models/couponSchema");
const moment = require('moment')
const fs = require("fs");

module.exports = {
    adminHome: async (req, res) => {
        try {
            const order = await Order.find().sort({createdAt: -1,}).lean();
            for (let i = 0; i < order.length; i++) {
                if (order[i].orderStatus == 'Pending') {
                    order[i].pending = true
                }
                const testDate = order[i].createdAt
                order[i].testDate = moment(testDate).format('DD MMMM , YYYY')
            }

            // let totalSelling =await Order.find({orderStatus:'Delivered'}).count()
            // let todayDate= new Date();
            // todayDate.setDate(todayDate.getDate());
            // console.log(todayDate);
            // let totalIncome = await Order.aggregate([
            //     {
            //         $match : {
            //             "deliveryDate" : { $lte : todayDate }
            //             }
            //     },
            //     {
            //         $group : {
            //             _id : null,
            //             totalIncome : {$sum : "$totalLast"}
            //         }
            //     },
            // ])

            // console.log(totalIncome)
            
            // if(totalIncome[0]){
            //     totalIncome=(totalIncome[0].totalIncome/100)*25 
            //     totalIncome=Math.round(totalIncome)
            // }

            let monthlTtotalIncome = await Order.aggregate([
                    {
                        $project : {
                            'totalLast' : true,
                            'createdAt' : true
                        }
                    },
                    {
                        $group : {
                            _id : { '$month' : '$createdAt'},
                            totalIncome : {$sum : "$totalLast"}
                        }
                    },
                    {
                        $sort : {
                            _id : 1
                        }
                    },
                ])

                console.log(monthlTtotalIncome);

            res.render("admin/dashboard",{order, monthlTtotalIncome});
        } catch (error) {
            console.log(error.message);
        }
    },
    adminLogin: (req, res) => {
        try {
            if (req.session.adminLogged) {
                res.redirect("/admin_panel");
            } else {
                res.render("admin/adminlogin");
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    adminLoginPost: async (req, res) => {
        try {
            const adminData = req.body;
            const email = await Admin.findOne({ adminEmail: adminData.adminEmail });
            if (email) {
                if (email.adminPass === adminData.adminPass) {
                    req.session.adminLogged = true;
                    res.redirect("/admin_panel");
                } else {
                    res.render("admin/adminlogin", {
                        errorPassword: "This Password is Incorrect !",
                    });
                }
            } else {
                res.render("admin/adminlogin", {
                    errorUname: "This Username is Incorrect !",
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    adminLogout: (req, res) => {
        try {
            req.session.adminLogged = false;
            res.redirect("/admin_panel/admin_login");
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminProduct: async (req, res) => {
        try {
            const product = await Product.find();
            res.render("admin/products", { product });
        } catch (error) {
            console.log(error.message);
        }
    },
    adminAddProduct: async (req, res) => {
        try {
            const category = await Category.find();
            res.render("admin/addproduct", { category });
        } catch (error) {
            console.log(error.message);
        }
    },
    adminAddProductPost: async (req, res) => {
        try {
            const proImg = {
                PName: req.body.PName,
                PDes: req.body.PDes,
                PCategory: req.body.PCategory,
                PSubCategory: req.body.PSubCategory,
                PPrice: req.body.PPrice,
                POldPrice: req.body.POldPrice,
                PImage: req.body.images,
                PBrand: req.body.PBrand,
                PStock: req.body.PStock,
                PDiscount: req.body.PDiscount,
                PSize: req.body.PSize,
                PColor: req.body.PColor,
            };
            await Product.create(proImg);
            res.redirect("/admin_panel/admin_product");
        } catch (error) {
            console.log(error.message);
        }
    },
    adminEditProduct: async (req, res) => {
        try {
            const { _id } = req.query;
            const productEdit = await Product.findById({ _id: _id });
            const category = await Category.find();
            res.render("admin/editproduct", { productEdit, category });
        } catch (error) {
            console.log(error.message);
        }
    },
    adminEditProductPost: async (req, res) => {
        try {
            const { _id } = req.query;
            const productEdit = await Product.findById(_id);
            if (req.body.images == "" || req.body.PSize == "" || req.body.PColor == "") {
                await Product.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            PName: req.body.PName,
                            PDes: req.body.PDes,
                            PCategory: req.body.PCategory,
                            PSubCategory: req.body.PSubCategory,
                            PPrice: req.body.PPrice,
                            POldPrice: req.body.POldPrice,
                            PBrand: req.body.PBrand,
                            PStock: req.body.PStock,
                            PDiscount: req.body.PDiscount
                        },
                    }
                );
            } else {
                const img = productEdit.PImage;
                const len = img.length;
                for (let i = 0; i < len; i++) {
                    const imgPath = img[i];
                    fs.unlink('./public/images/' + imgPath, function () {
                        console.log("Removed");
                    });
                }
                await Product.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            PName: req.body.PName,
                            PDes: req.body.PDes,
                            PCategory: req.body.PCategory,
                            PSubCategory: req.body.PSubCategory,
                            PPrice: req.body.PPrice,
                            POldPrice: req.body.POldPrice,
                            PImage: req.body.images,
                            PBrand: req.body.PBrand,
                            PStock: req.body.PStock,
                            PDiscount: req.body.PDiscount,
                            PSize: req.body.PSize,
                            PColor: req.body.PColor,
                        },
                    }
                );
            }
            res.redirect("/admin_panel/admin_product");
        } catch (error) {
            console.log(error.message);
        }
    },
    adminDeleteProduct: async (req, res) => {
        try {
            const { _id } = req.query;
            const productDelete = await Product.findById({ _id: _id });
            const img = productDelete.PImage;
            const len = img.length;
            for (let i = 0; i < len; i++) {
                const imgPath = img[i];
                fs.unlink('./public/images/' + imgPath, function () {
                    console.log("Removed");
                });
            }
            await Product.deleteOne(productDelete);
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminOrder: async (req, res) => {
        try {
            const pendingOrder = await Order.find().sort({createdAt: -1,}).lean();
            let order = [];
            let count = 0
            for (let i = 0; i < pendingOrder.length; i++) {
                if (pendingOrder[i].orderStatus != 'Pending') {
                    order[i] = pendingOrder[i]
                    const testDate = pendingOrder[i].createdAt
                    order[i].testDate = moment(testDate).format('DD MMMM , YYYY')
                    order[i].no = count = count + 1
                }
            }
            console.log(order);

            res.render("admin/orders", { order });
        } catch (error) {
            console.log(error.message);
        }
    },
    orderDetails: async (req, res) => {
        try {
            const { id } = req.query
            console.log(id);
            const order = await Order.findById(id)
            res.render("admin/viewOrder", { order });
        } catch (error) {
            console.log(error.message);
        }
    },
    statusChange: async (req, res) => {
        try {
            const statusBody = req.body
            const order = await Order.findById(statusBody.orderId)
            console.log(statusBody);
            console.log(statusBody.status);
            if (order.paymentMethod == 'Cash on Delivery') {
                if (statusBody.status == 'Delivered') {
                    await Order.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: 'Paid'
                        }
                    })
                } else {
                    await Order.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: 'Unpaid'
                        }
                    })
                }
            } else {
                await Order.findByIdAndUpdate(statusBody.orderId, {
                    $set: {
                        orderStatus: statusBody.status
                    }
                })
            }

            res.json(true)
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminUser: async (req, res) => {
        try {
            const users = await User.find();
            res.render("admin/users", { users });
        } catch (error) {
            console.log(error.message);
        }
    },
    adminUserBlock: async (req, res) => {
        try {
            const { userEmail } = req.query;
            await User.updateOne({ userEmail: userEmail }, { isBanned: true });
        } catch (error) {
            console.log(error.message);
        }
    },
    adminUserActive: async (req, res) => {
        try {
            const { userEmail } = req.query;
            await User.updateOne({ userEmail: userEmail }, { isBanned: false });
            res.redirect("/admin_panel/admin_user");
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            res.render("admin/category", { categories });
        } catch (error) {
            console.log(error.message);
        }
    },
    addCategory: async (req, res) => {
        try {
            console.log(req.body);
            const existCat = await Category.findOne({ Category: req.body.Category })
            console.log(existCat);
            if (existCat) {
                const categories = await Category.find();
                res.render("admin/category", { categories, existCat });
            } else {
                const category = {
                    Category: req.body.Category,
                    imgCategory: req.body.images,
                    subCategory: req.body.subCategory
                }
                await Category.create(category);
                res.redirect("/admin_panel/admin_category");
            }

        } catch (error) {
            console.log(error.message);
        }
    },
    editCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const newCategory = req.body;
            const categoryEdit = await Category.findById(_id);
            const subCat = newCategory.subCategory.split(",");
            if (req.body.images == '') {
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
                            subCategory: subCat
                        },
                    }
                );
            } else {
                const image = categoryEdit.imgCategory;
                const len = image.length;
                for (let i = 0; i < len; i++) {
                    const imagePath = image[i];
                    fs.unlink('./public/images/' + imagePath, function () {
                        console.log("Removed");
                    });
                }
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
                            imgCategory: newCategory.images,
                            subCategory: subCat
                        },
                    }
                );
            }
            res.redirect("/admin_panel/admin_category");

        } catch (error) {
            console.log(error.message);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const catDelete = await Category.findById({ _id: _id });
            const products = await Product.findOne({ PCategory: catDelete.Category })
            console.log(products);
            if (products) {
                const categories = await Category.find();
                res.render("admin/category", { categories, products });
            } else {
                const img = catDelete.imgCategory;
                const len = img.length;
                for (let i = 0; i < len; i++) {
                    const imgPath = img[i];
                    fs.unlink('./public/images/' + imgPath, function () {
                        console.log("Removed");
                    });
                }
                await Category.deleteOne({ _id: _id });
            }
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteSubCategory: async (req, res) => {
        try {
            const { _id, sub } = req.query;
            const subdelete = await Category.findById({ _id: _id });
            const index = subdelete.subCategory.indexOf(sub);
            const afterdel = subdelete.subCategory.splice(index, 1);
            await Category.updateOne(
                { _id: _id },
                {
                    $set: {
                        Category: subdelete.Category,
                        subCategory: subdelete.subCategory,
                    },
                }
            );
        } catch (error) {
            console.log(error.message);
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminCoupon: async (req, res) => {
        try {
            const coupon = await Coupon.find()
            for (let i = 0; i < coupon.length; i++) {
                const testDate = coupon[i].expiryDate
                coupon[i].date = moment(testDate).format('DD MMMM , YYYY')
            }
            res.render("admin/coupons",{coupon});
        } catch (error) {
            console.log(error.message);
        }
    },
    addCoupon: async (req, res) => {
        try {
            await Coupon.create(req.body)
            res.redirect('/admin_panel/admin_coupon')
        } catch (error) {
            console.log(error.message);
        }
    },
};
