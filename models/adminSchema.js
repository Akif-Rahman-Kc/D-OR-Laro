const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const adminSchema = new schema({
  adminEmail : {
        type: String,
        required: true,
        trim: true
      },
    adminPass:{
        type: String,
        required: true,
        minlength: 6,
        trim: true
      }
},{ timestamps: true });



module.exports = mongoose.model('admins',adminSchema);