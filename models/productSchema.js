const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
  PName : {
        type: String,
        required: true,
        trim: true
      },
    PDes:{
        type: String,
        required: true,
        trim: true
      },
    PCategory:{
        type: String,
        required: true,
        trim: true
      },
    PSubCategory:{
        type: String,
        required: true,
        trim: true
      },
    PPrice:{
        type: Number,
        required: true,
        trim: true
      },
    POldPrice:{
        type: Number,
        required: true,
        trim: true
      },
    PImage:{
        type: Array,
        required: true,
        trim: true
      },
    PBrand:{
        type: String,
        required: true,
        trim: true
      },
    PStock:{
        type: Number,
        required: true,
        trim: true
      },
    PDiscount:{
      type: Number,
      required: true,
      trim: true
    },
    PSize:{
        type: Array,
        required: true,
        trim: true
      }, 
    PColor:{
        type: Array,
        required: true,
        trim: true
      },
},{ timestamps: true });



module.exports = mongoose.model('product',productSchema);