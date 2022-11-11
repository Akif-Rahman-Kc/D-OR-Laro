const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/auth')
const fileUpload = require('../middleware/multer')
const multiplefileupload = require("../middleware/fileupload")

// router.post('/admin_add_product',fileUpload.upload.array('PImage',5));
// router.post('/admin_edit_product',fileUpload.upload.array('PImage',5));
// router.post('/admin_add_product',);
router.post('/admin_edit_product',multiplefileupload.uploadImages,multiplefileupload.resizeImages);

// router.post('/admin_category',multiplefileupload.uploadImage,multiplefileupload.resizeImages);
// router.post('/admin_category/edit',multiplefileupload.uploadImage,multiplefileupload.resizeImages);

// router.post('/admin_category', fileUpload.upload.single('imgCategory'));
// router.post('/admin_category/edit', fileUpload.upload.single('imgCategory'));

router.get('/', adminAuth.sessionAdmin,adminController.adminHome);

router.get('/admin_login', adminController.adminLogin);
router.post('/admin_login', adminController.adminLoginPost);
router.get('/admin_logout', adminController.adminLogout);

router.get('/admin_product', adminAuth.sessionAdmin,adminController.adminProduct);
router.get('/admin_add_product', adminAuth.sessionAdmin,adminController.adminAddProduct);
router.post('/admin_add_product', adminAuth.sessionAdmin,multiplefileupload.uploadImages,multiplefileupload.resizeImages,adminController.adminAddProductPost);
router.get('/admin_edit_product', adminAuth.sessionAdmin,adminController.adminEditProduct);
router.post('/admin_edit_product', adminAuth.sessionAdmin,adminController.adminEditProductPost);
router.get('/admin_delete_product', adminAuth.sessionAdmin,adminController.adminDeleteProduct);

router.get('/admin_order', adminAuth.sessionAdmin,adminController.adminOrder);

router.get('/admin_user', adminAuth.sessionAdmin,adminController.adminUser);
router.get('/admin_user/block', adminAuth.sessionAdmin,adminController.adminUserBlock);
router.get('/admin_user/active', adminAuth.sessionAdmin,adminController.adminUserActive);

router.get('/admin_category', adminAuth.sessionAdmin,adminController.adminCategory);
router.post('/admin_category', adminAuth.sessionAdmin,adminController.addCategory);
router.post('/admin_category/edit', adminAuth.sessionAdmin,adminController.editCategory);
router.get('/admin_category/delete', adminAuth.sessionAdmin,adminController.deleteCategory);
router.get('/admin_category/subdelete', adminAuth.sessionAdmin,adminController.deleteSubCategory);

module.exports = router;