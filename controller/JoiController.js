const Joi = require('../models/JoiSchema')

module.exports = {
    userAuthValidate:(req, res, next) =>{
         const {error} = Joi.userAuthSchema.validate(req.body)
         if(error){
            console.log(error.details[0]);
            return res.render("user/register", { message : error.details[0].context.label });
         }else{
            next()
         }
    }
}