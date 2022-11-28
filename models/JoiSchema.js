const Joi = require('joi')

module.exports.userAuthSchema = Joi.object({
    userFName: Joi.required().label('Please Enter the First Name'),
    userLName: Joi.required().label('Please Enter the Second Name'),
    userEmail: Joi.required().label('Please Enter the Email'),
    userPhoneNo: Joi.required().label('Please enter the Phone Number'),
    userPass: Joi.required().label('Please enter the Password'),
    userConfPass: Joi.required().label('Please enter the Confirm Password'),
});

module.exports.productSchema = Joi.object({
    PName: Joi.required().label('Please enter the product Name'),
    PDes: Joi.required().label('Please enter the product Description'),
    PCategory: Joi.required().label('Please select the product category'),
    PSubCategory: Joi.required().label('Please select the product sub category'),
    PPrice: Joi.required().label('Please enter the product price'),
    POldPrice: Joi.required().label('Please enter the product old price'),
    PImage: Joi.required().label('Please select the images'),
    PBrand: Joi.required().label('Please enter the brand name'),
    PStock: Joi.required().label('Please enter the stock value'),
    PDiscount: Joi.required().label('Please Enter the discount amount'),
    PSize: Joi.required().label('Please select the product sizes'),
    PColor: Joi.required().label('Please select the product colors'),
});

module.exports.couponSchema = Joi.object({
    couponName: Joi.required().label('Please enter the coupon Name'),
    couponDes: Joi.required().label('Please enter the coupon Description'),
    couponCode: Joi.required().label('Please enter the coupon code'),
    percentage: Joi.required().label('Please enter the percentage'),
    minCartAmount: Joi.required().label('Please enter the minimum cart amount'),
    maxRadeemAmount: Joi.required().label('Please enter the maxmimum redeem amount'),
    startDate: Joi.required().label('Please select the start date'),
    expiryDate: Joi.required().label('Please select the expiry date'),
});

module.exports.adminAuthSchema = Joi.object({
    adminEmail: Joi.required().label('Please enter your correct Email'),
    adminPass: Joi.required().label('Please enter your correct password'),
});

