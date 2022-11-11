const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");
const fs = require("fs");
const path = require("path");

module.exports = {
    adminHome: (req, res) => {
        try {
             res.render("admin/dashboard");
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
            const size = req.body.PSize.split(",");
            const color = req.body.PColor.split(",");
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
                PSize: size,
                PColor: color,
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
        const size = req.body.PSize.split(",");
        const color = req.body.PColor.split(",");
        if (req.body.images == "") {

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
                        PDiscount: req.body.PDiscount,
                        PSize: size,
                        PColor: color,
                    },
                }
            );
        } else {
            const img = productEdit.PImage;
            const len = img.length;
            for (let i = 0; i < len; i++) {
                const imgPath = img[i];
                fs.unlink('./public/img/'+imgPath, function () {
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
                        PSize: size,
                        PColor: color,
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
            fs.unlink('./public/img/'+imgPath, function () {
                console.log("Removed");
            });
        }
        await Product.deleteOne(productDelete);
        res.redirect("/admin_panel/admin_product");
        } catch (error) {
            console.log(error.message);
        }
    },
    adminOrder: (req, res) => {
        try {
            res.render("admin/orders");
        } catch (error) {
            console.log(error.message);
        }
    },
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
            res.redirect("/admin_panel/admin_user");
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
             const img = req.file
        const category = {
            Category: req.body.Category,
            imgCategory: img,
            subCategory: req.body.subCategory
        }
        await Category.create(category);
        res.redirect("/admin_panel/admin_category");
        } catch (error) {
            console.log(error.message);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const catDelete = await Category.findById({ _id: _id });
            const img = catDelete.imgCategory;
            const len = img.length;
            for (let i = 0; i < len; i++) {
                const imgPath = img[i];
                fs.unlink(imgPath.path, function () {
                    console.log("Removed");
                });
            }
            await Category.deleteOne({ _id: _id });
            res.redirect("/admin_panel/admin_category");
        } catch (error) {
            console.log(error.message);
        }
    },
    editCategory: async (req, res) => {
        try {
            const { _id } = req.query;
            const newCategory = req.body;
            const img = req.file
            const categoryEdit = await Category.findById(_id);
            const subCat = newCategory.subCategory.split(",");
            if (img) {
                const image = categoryEdit.imgCategory;
                const len = image.length;
                for (let i = 0; i < len; i++) {
                    const imagePath = image[i];
                    fs.unlink(imagePath.path, function () {
                        console.log("Removed");
                    });
                }
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
                            imgCategory: img,
                            subCategory: subCat
                        },
                    }
                );
            } else {
                await Category.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            Category: newCategory.Category,
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
            res.redirect("/admin_panel/admin_category");
        } catch (error) {
            console.log(error.message);
        }
    },
};
