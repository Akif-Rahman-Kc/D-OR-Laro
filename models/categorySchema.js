const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
  Category : {
        type: String,
        required: [true,'Please enter the category'],
        trim: true
      },
    imgCategory:{
        type: Array,
        required: [true,'Please upload image'],
        trim: true
      },
    subCategory:{
        type: Array,
        required: [true,'Please enter the sub category'],
        trim: true
      }
});



module.exports = mongoose.model('category',categorySchema);