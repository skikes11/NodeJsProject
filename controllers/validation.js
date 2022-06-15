const Joi = require('joi');

// Register Validate
const registerValidation = function(data){
    const schema = Joi.object ({
        username: Joi.string()
                 .min(4)
                 .required(),
        name: Joi.string()
                   .email()
                   .min(6)
                   .required(),
        password: Joi.string()
                   .min(6)
                   .required(),
                          
    })
   return  schema.validate(data)
}
module.exports = registerValidation;