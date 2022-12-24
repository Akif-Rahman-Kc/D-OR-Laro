const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/auth')
const multiplefileupload = require("../middleware/filesupload")
const singlefileupload = require("../middleware/fileupload")


// 404

router.get('/admin_404', adminController.admin404)

// Authentication

router.get('/admin_login', adminController.adminLogin);
router.post('/admin_login', adminController.adminLoginPost);
router.get('/admin_logout', adminController.adminLogout);

router.get('/', adminAuth.sessionAdmin,adminController.adminHome);

// Producat Management

router.get('/admin_product', adminAuth.sessionAdmin,adminController.adminProduct);
router.get('/admin_add_product', adminAuth.sessionAdmin,adminController.adminAddProduct);
router.post('/admin_add_product', adminAuth.sessionAdmin,multiplefileupload.uploadImages,multiplefileupload.resizeImages,adminController.adminAddProductPost);
router.get('/admin_edit_product', adminAuth.sessionAdmin,adminController.adminEditProduct);
router.post('/admin_edit_product', adminAuth.sessionAdmin,multiplefileupload.uploadImages,multiplefileupload.resizeImages,adminController.adminEditProductPost);
router.get('/admin_delete_product', adminAuth.sessionAdmin,adminController.adminDeleteProduct);

// Order Management

router.get('/admin_order', adminAuth.sessionAdmin,adminController.adminOrder);
router.get('/order_details', adminAuth.sessionAdmin,adminController.orderDetails);
router.post('/status_change',adminController.statusChange);

// User Management

router.get('/admin_user', adminAuth.sessionAdmin,adminController.adminUser);
router.get('/admin_user/block', adminAuth.sessionAdmin,adminController.adminUserBlock);
router.get('/admin_user/active', adminAuth.sessionAdmin,adminController.adminUserActive);

// Category Management

router.get('/admin_category', adminAuth.sessionAdmin,adminController.adminCategory);
router.post('/admin_category', adminAuth.sessionAdmin,singlefileupload.uploadImages,singlefileupload.resizeImages,adminController.addCategory);
router.post('/admin_category/edit', adminAuth.sessionAdmin,singlefileupload.uploadImages,singlefileupload.resizeImages,adminController.editCategory);
router.get('/admin_category/delete', adminAuth.sessionAdmin,adminController.deleteCategory);
router.get('/admin_category/subdelete', adminAuth.sessionAdmin,adminController.deleteSubCategory);

// Coupon Management

router.get('/admin_coupon', adminAuth.sessionAdmin,adminController.adminCoupon);
router.post('/add_coupon', adminAuth.sessionAdmin,adminController.addCoupon);
router.get('/delete_coupon', adminAuth.sessionAdmin,adminController.deleteCoupon);


module.exports = router;