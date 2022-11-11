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
    paymentMethod : {
        type: String,
        required: true,
        trim: true
      },
    orderStatus : {
        type: String,
        required: true,
        trim: true
      },
    totalAmount : {
        type: Object,
        required: true,
        trim: true
      },
    orderDate : {
        type: Date,
        required: true,
        trim: true
      },
});

module.exports = mongoose.model('orders',orderSchema);