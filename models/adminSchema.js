const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const adminSchema = new schema({
  adminEmail : {
        type: String,
        required: [true,'Please enter your Email'],
        trim: true
      },
    adminPass:{
        type: String,
        required: [true,'Please enter the Password'],
        minlength: [6,'Minimum Password Length is 6 Charcter'],
        trim: true
      }
});



module.exports = mongoose.model('admins',adminSchema);