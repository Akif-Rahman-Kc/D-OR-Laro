const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
  PName : {
        type: String,
        required: [true,'Please enter the Product Name'],
        trim: true
      },
    PDes:{
        type: String,
        required: [true,'Please enter the Product Description'],
        trim: true
      },
    PCategory:{
        type: String,
        required: [true,'Please enter the Category'],
        trim: true
      },
    PSubCategory:{
        type: String,
        required: [true,'Please enter the Sub Category'],
        trim: true
      },
    PPrice:{
        type: Number,
        required: [true,'Please enter the Price'],
        trim: true
      },
    POldPrice:{
        type: Number,
        required: [true,'Please enter the Old Price'],
        trim: true
      },
    PImage:{
        type: Array,
        required: [true,'Please upload the Images'],
        trim: true
      },
    PBrand:{
        type: String,
        required: [true,'Please enter the Brand Name'],
        trim: true
      },
    PStock:{
        type: Number,
        required: [true,'Please enter the Product Stock'],
        trim: true
      },
    PDiscount:{
      type: Number,
      required: [true,'Please enter the Product Discount'],
      trim: true
    },
    PSize:{
        type: Array,
        required: [true,'Please enter the Product Sizes'],
        trim: true
      }, 
    PColor:{
        type: Array,
        required: [true,'Please enter the Product Colors'],
        trim: true
      },
});



module.exports = mongoose.model('product',productSchema);