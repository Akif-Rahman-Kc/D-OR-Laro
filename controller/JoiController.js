const Joi = require('../models/JoiSchema')

module.exports = {
    userAuthValidate:(req, res, next) =>{
         const {error , value} = Joi.userAuthSchema.validate(req.body)
         if(error){
            console.log(error.details[0].context.label);
            const errorValidation = error.details[0].context.label
            res.render("user/register", { errorValidation });
         }else{
            next()
         }
    }
}