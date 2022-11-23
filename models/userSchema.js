const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  userFName : {
        type: String,
        required: true,
        trim: true
      },
      userLName : {
        type: String,
        trim: true
      },
      userEmail : {
        type: String,
        lowercase:true,
        unique:true,
        required: true,
        trim: true
      },
      userPhoneNo:{
        required: true,
        type: String,
        trim: true
      },
      userPass:{
        type: String,
        required: true,
        minlength: 6,
        trim: true
      },
      isBanned:{
        type:Boolean,
        default:false
      },
      Cart:{
        type: Array
      },
      cartTotals : {
        type: Object
      },
      Address:{
        type: Array
      },
      Wishlist:{
        type: Array
      },
      Coupon:{
        type: Array
      },
      applyCoupon : {
        type: Boolean,
        default:false
      },
      usedCoupon:{
        type: Array
      },
},{ timestamps: true });

module.exports = mongoose.model('users',userSchema);