const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
  Category : {
        type: String,
        required: true,
        trim: true
      },
    imgCategory:{
        type: Array,
        required: true,
        trim: true
      },
    subCategory:{
        type: Array,
        required: true,
        trim: true
      }
},{ timestamps: true });



module.exports = mongoose.model('category',categorySchema);