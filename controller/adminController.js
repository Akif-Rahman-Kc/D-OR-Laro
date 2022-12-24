const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const Coupon = require("../models/couponSchema");
const moment = require("moment");
const fs = require("fs");
const { now } = require("mongoose");

module.exports = {
    admin404: (req, res) => {
        res.render("admin/admin404");
    },
    adminHome: async (req, res) => {
        try {
            const order = await Order.find().sort({ createdAt: -1 }).lean();
            console.log(order);
            for (let i = 0; i < order.length; i++) {
                if (order[i].orderStatus == "Pending" || order[i].orderStatus == "Cancelled") {
                    order[i].cancel = true;
                }
                const testDate = order[i].createdAt;
                order[i].testDate = moment(testDate).format("DD MMMM , YYYY");
            }

            let monthlyTtotalIncome = await Order.aggregate([
                {
                    $match: {
                        orderStatus: "Delivered",
                    },
                },
                {
                    $project: {
                        totalLast: true,
                        createdAt: true,
                    },
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        totalIncome: { $sum: "$totalLast" },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            console.log(monthlyTtotalIncome,"edaaaaaaaaaa");
            const month = [
                "jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            monthlyTtotalIncome = month.map((el, ind) => {
                const found = monthlyTtotalIncome.find((elm) => elm._id === ind + 1);
                return found ? found.totalIncome : 0;
            });
            console.log(monthlyTtotalIncome);

            let testDate = new Date();
            let date = moment(testDate).format("MM");
            date = parseInt(date) - 1;
            let totalIncomeAtMonth = monthlyTtotalIncome[date];
            totalIncomeAtMonth = Math.round(totalIncomeAtMonth);
            res.locals.totalIncomeAtMonth = totalIncomeAtMonth;

            monthlyTtotalIncome = JSON.stringify(monthlyTtotalIncome);

            let todayTtotalIncome = await Order.aggregate([
                {
                    $match: {
                        orderStatus: "Delivered",
                    },
                },
                {
                    $project: {
                        totalLast: true,
                        createdAt: true,
                    },
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" },
                        totalIncome: { $sum: "$totalLast" },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            const day = [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            ];
            todayTtotalIncome = day.map((el, ind) => {
                const found = todayTtotalIncome.find((elm) => elm._id === ind + 1);
                return found ? found.totalIncome : 0;
            });
            console.log(todayTtotalIncome);

            let dayDate = moment(testDate).format("DD");
            dayDate = parseInt(dayDate) - 1;
            console.log(dayDate);
            let totalIncomeAtDay = todayTtotalIncome[dayDate];
            totalIncomeAtDay = Math.round(totalIncomeAtDay);
            res.locals.totalIncomeAtDay = totalIncomeAtDay;

            let yrarlyTtotalIncome = await Order.aggregate([
                {
                    $match: {
                        orderStatus: "Delivered",
                    },
                },
                {
                    $project: {
                        totalLast: true,
                        createdAt: true,
                    },
                },
                {
                    $group: {
                        _id: { $year: "$createdAt" },
                        totalIncome: { $sum: "$totalLast" },
                    },
                },
                {
                    $sort: {
                        _id: -1,
                    },
                },
            ]);

            if (yrarlyTtotalIncome == []) {
                yrarlyTtotalIncome = 0;
            } else {
                yrarlyTtotalIncome = yrarlyTtotalIncome[0].totalIncome;
            }

            yrarlyTtotalIncome = Math.round(yrarlyTtotalIncome);
            res.locals.yrarlyTtotalIncome = yrarlyTtotalIncome;

            let monthlyTtotalSells = await Order.aggregate([
                {
                    $match: {
                        orderStatus: "Delivered",
                    },
                },
                {
                    $unwind: "$items",
                },
                {
                    $project: {
                        createdAt: true,
                    },
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        totalSells: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            monthlyTtotalSells = month.map((el, ind) => {
                const found = monthlyTtotalSells.find((elm) => elm._id === ind + 1);
                return found ? found.totalSells : 0;
            });
            console.log(monthlyTtotalSells);
            monthlyTtotalSells = JSON.stringify(monthlyTtotalSells);

            let monthlyCancelProduct = await Order.aggregate([
                {
                    $match: {
                        orderStatus: "Cancelled",
                    },
                },
                {
                    $unwind: "$items",
                },
                {
                    $project: {
                        createdAt: true,
                    },
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        totalCancel: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            monthlyCancelProduct = month.map((el, ind) => {
                const found = monthlyCancelProduct.find((elm) => elm._id === ind + 1);
                return found ? found.totalCancel : 0;
            });
            console.log(monthlyCancelProduct);
            monthlyCancelProduct = JSON.stringify(monthlyCancelProduct);

            //sales report
            const sort = req.query;
            if (sort.no == 1) {
                console.log("11111");
                const today = moment().startOf("day");
                const totalSells = await Order.find({
                    orderStatus: 'Delivered',
                    createdAt: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf("day").toDate(),
                    },
                });
                for (let i = 0; i < totalSells.length; i++) {
                    const testDate = totalSells[i].createdAt;
                    totalSells[i].date = moment(testDate).format("DD MMMM , YYYY");
                }
                console.log(totalSells);
                const total = totalSells.reduce(
                    (acc, cur) => (acc + cur.totalLast),0,
                  );
                res.locals.total = total
                res.locals.totalSells = totalSells
            } else if (sort.no == 2) {
                console.log("22222");
                const month = moment().startOf('month')
                const totalSells = await Order.find({
                    orderStatus: 'Delivered',
                    createdAt: {
                        $gte: month.toDate(),
                        $lte: moment(month).endOf('month').toDate()
                    }
                })
                for (let i = 0; i < totalSells.length; i++) {
                    const testDate = totalSells[i].createdAt;
                    totalSells[i].date = moment(testDate).format("DD MMMM , YYYY");
                }
                console.log(totalSells);
                const total = totalSells.reduce(
                    (acc, cur) => (acc + cur.totalLast),0,
                  );
                res.locals.total = total
                res.locals.totalSells = totalSells
            } else if (sort.no == 3) {
                console.log("33333");
                const year = moment().startOf('year')
                const totalSells = await Order.find({
                    orderStatus: 'Delivered',
                    createdAt: {
                        $gte: year.toDate(),
                        $lte: moment(year).endOf('year').toDate()
                    }
                })
                for (let i = 0; i < totalSells.length; i++) {
                    const testDate = totalSells[i].createdAt;
                    totalSells[i].date = moment(testDate).format("DD MMMM , YYYY");
                }
                console.log(totalSells);
                const total = totalSells.reduce(
                    (acc, cur) => (acc + cur.totalLast),0,
                  );
                res.locals.total = total
                res.locals.totalSells = totalSells
            } else {
                console.log("00000");
                const totalSells = await Order.find({ orderStatus: "Delivered" });
                for (let i = 0; i < totalSells.length; i++) {
                    const testDate = totalSells[i].createdAt;
                    totalSells[i].date = moment(testDate).format("DD MMMM , YYYY");
                }
                const total = totalSells.reduce(
                    (acc, cur) => (acc + cur.totalLast),0,
                  );
                res.locals.total = total
                res.locals.totalSells = totalSells
            }

            res.render("admin/dashboard", {
                order,
                monthlyTtotalIncome,
                monthlyTtotalSells,
                monthlyCancelProduct
            });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
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
            res.redirect("/admin_404");
        }
    },
    adminLoginPost: async (req, res) => {
        try {
            const adminData = req.body;
            const email = await Admin.findOne({ adminEmail: adminData.adminEmail });
            if (email) {
                if (email.adminPass === adminData.adminPass) {
                    req.session.adminLogged = true;
                    req.session.admin = email;
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
            res.redirect("/admin_404");
        }
    },
    adminLogout: (req, res) => {
        try {
            req.session.adminLogged = false;
            res.redirect("/admin_panel/admin_login");
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminProduct: async (req, res) => {
        try {
            const product = await Product.find();
            res.render("admin/products", { product });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    adminAddProduct: async (req, res) => {
        try {
            const category = await Category.find();
            res.render("admin/addproduct", { category });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
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
            res.redirect("/admin_404");
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
            res.redirect("/admin_404");
        }
    },
    adminEditProductPost: async (req, res) => {
        try {
            const { _id } = req.query;
            const productEdit = await Product.findById(_id);
            if (req.body.images != '') {
                const img = productEdit.PImage;
                const len = img.length;
                for (let i = 0; i < len; i++) {
                    const imgPath = img[i];
                    fs.unlink("./public/images/" + imgPath, function () {
                        console.log("Removed");
                    });
                }
                await Product.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            PImage: req.body.images
                        }
                    }
                );
            } 
            if (req.body.PColor) {

                await Product.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            PColor: req.body.PColor
                        }
                    }
                );
            }
            if (req.body.PSize) {
                await Product.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            PSize: req.body.PSize
                        }
                    }
                );
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
                        PBrand: req.body.PBrand,
                        PStock: req.body.PStock,
                        PDiscount: req.body.PDiscount
                    }
                }
            );
            res.redirect("/admin_panel/admin_product");
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
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
                fs.unlink("./public/images/" + imgPath, function () {
                    console.log("Removed");
                });
            }
            await Product.deleteOne(productDelete);
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminOrder: async (req, res) => {
        try {
            const pendingOrder = await Order.find().sort({ createdAt: -1 }).lean();
            let order = [];
            let count = 0;
            for (let i = 0; i < pendingOrder.length; i++) {
                if (pendingOrder[i].orderStatus != "Pending") {
                    order[i] = pendingOrder[i];
                    const testDate = pendingOrder[i].createdAt;
                    order[i].testDate = moment(testDate).format("DD MMMM , YYYY");
                    order[i].no = count = count + 1;
                    if (order[i].orderStatus == 'Cancelled') {
                        order[i].Cancelled = true
                    }
                }
            }

            res.render("admin/orders", { order });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    orderDetails: async (req, res) => {
        try {
            const { id } = req.query;
            console.log(id);
            const order = await Order.findById(id);
            res.render("admin/viewOrder", { order });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    statusChange: async (req, res) => {
        try {
            const statusBody = req.body;
            const order = await Order.findById(statusBody.orderId);
            console.log(statusBody);
            console.log(statusBody.status);
            if (order.paymentMethod == "Cash on Delivery") {
                if (statusBody.status == "Delivered") {
                    await Order.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: "Paid",
                        },
                    });
                } else {
                    await Order.findByIdAndUpdate(statusBody.orderId, {
                        $set: {
                            orderStatus: statusBody.status,
                            paymentStatus: "Unpaid",
                        },
                    });
                }
            } else {
                await Order.findByIdAndUpdate(statusBody.orderId, {
                    $set: {
                        orderStatus: statusBody.status,
                    },
                });
            }

            res.json(true);
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminUser: async (req, res) => {
        try {
            const users = await User.find();
            res.render("admin/users", { users });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    adminUserBlock: async (req, res) => {
        try {
            const { userEmail } = req.query;
            await User.updateOne({ userEmail: userEmail }, { isBanned: true });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    adminUserActive: async (req, res) => {
        try {
            const { userEmail } = req.query;
            await User.updateOne({ userEmail: userEmail }, { isBanned: false });
            res.redirect("/admin_panel/admin_user");
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            res.render("admin/category", { categories });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    addCategory: async (req, res) => {
        try {
            console.log(req.body);
            const existCat = await Category.findOne({ Category: req.body.Category });
            console.log(existCat);
            if (existCat) {
                const categories = await Category.find();
                res.render("admin/category", { categories, existCat,proExistError:"This Category Already Added" });
            } else {
                const category = {
                    Category: req.body.Category,
                    imgCategory: req.body.images,
                    subCategory: req.body.subCategory,
                };
                await Category.create(category);
                res.redirect("/admin_panel/admin_category");
            }
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    editCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const newCategory = req.body;
            const categoryEdit = await Category.findById(_id);
            const subCat = newCategory.subCategory.split(",");
            if (req.body.images == "") {
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
                            subCategory: subCat,
                        },
                    }
                );
            } else {
                const image = categoryEdit.imgCategory;
                const len = image.length;
                for (let i = 0; i < len; i++) {
                    const imagePath = image[i];
                    fs.unlink("./public/images/" + imagePath, function () {
                        console.log("Removed");
                    });
                }
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
                            imgCategory: newCategory.images,
                            subCategory: subCat,
                        },
                    }
                );
            }
            res.redirect("/admin_panel/admin_category");
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const catDelete = await Category.findById({ _id: _id });
            const products = await Product.findOne({ PCategory: catDelete.Category });
            console.log(products);
            if (products) {
                const categories = await Category.find();
                res.render("admin/category", { categories, products ,proExistError:"Product Available in this Category"});
            } else {
                const img = catDelete.imgCategory;
                const len = img.length;
                for (let i = 0; i < len; i++) {
                    const imgPath = img[i];
                    fs.unlink("./public/images/" + imgPath, function () {
                        console.log("Removed");
                    });
                }
                await Category.deleteOne({ _id: _id });
            }
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
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
            res.redirect("/admin_404");
        }
    },

    /////////////////////////////////////////////////////////////////////////

    adminCoupon: async (req, res) => {
        try {
            const coupon = await Coupon.find();
            let date = new Date();
            for (let i = 0; i < coupon.length; i++) {
                if (date > coupon[i].expiryDate) {
                    const id = coupon[i]._id;
                    await Coupon.deleteOne({ _id: id });
                } else {
                    const testDate = coupon[i].expiryDate;
                    coupon[i].date = moment(testDate).format("DD MMMM , YYYY");
                }
            }
            res.render("admin/coupons", { coupon });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    addCoupon: async (req, res) => {
        try {
            await Coupon.create(req.body);
            res.redirect("/admin_panel/admin_coupon");
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
    deleteCoupon: async (req, res) => {
        try {
            const { id } = req.query;
            await Coupon.deleteOne({ _id: id });
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin_404");
        }
    },
};
