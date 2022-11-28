const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
  Address : {
        type: Object,
        required: true,
        trim: true
      },
    userId : {
        type: String,
        required: true,
        trim: true
      }, 
    items : {
        type: Array,
        required: true,
        trim: true
      },
    paymentMethod : {
        type: String,
        required: true,
        trim: true
      },
    paymentStatus : {
        type: String,
        required: true,
        trim: true
      },
    orderStatus : {
        type: String,
        required: true,
        trim: true
      },
    totalProduct : {
        type: Number,
        required: true,
        trim: true
      },
    totalAmount : {
        type: Number,
        required: true,
        trim: true
      },
    discountPrice : {
        type: Number,
        required: true,
        trim: true
      },
    couponDiscount : {
        type: Number,
        required: true,
        trim: true 
      },
    totalLast : {
        type: Number,
        required: true,
        trim: true
      },
    deliveryDate : {
      type: String,
      required: true,
      trim: true
      }
},{ timestamps: true });

module.exports = mongoose.model('orders',orderSchema);