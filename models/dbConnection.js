const express = require('express')
const mongoose = require("mongoose");
const router = express.Router();

const mongoDB = "mongodb://127.0.0.1/DORLaro";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log("Connection failed",err);
})

module.exports = router;