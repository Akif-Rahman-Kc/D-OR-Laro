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
        type: Number,
        trim: true
      },
      userPass:{
        type: String,
        required: true,
        minlength: true,
        trim: true
      },
      isBanned:{
        type:Boolean,
        default:false
      },
      Cart:{
        type: Array
      },
      Address:{
        type: Array
      },
      Wishlist:{
        type: Array
      },
});

module.exports = mongoose.model('users',userSchema);