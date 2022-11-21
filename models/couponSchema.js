const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const couponSchema = new schema({
  couponName : {
    type: String,
    required: true,
    trim: true
  },
  couponDes : {
    type: String,
    required: true,
    trim: true
  },
  couponCode : {
        type: String,
        required: true,
        trim: true
      },
    percentage : {
        type: Number,
        required: true,
        trim: true
      },
    minCartAmount : {
        type: Number,
        required: true,
        trim: true
      },
    maxRadeemAmount : {
        type: Number,
        required: true,
        trim: true
    },
    startDate : {
        type: Date,
        required: true,
        trim: true
      },
    expiryDate : {
        type: Date,
        required: true,
        trim: true
      },
});

module.exports = mongoose.model('coupon',couponSchema);