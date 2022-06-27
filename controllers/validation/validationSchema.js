const joi = require("joi");
const schema = { 
      user : joi.object({
        email: joi.string().email().min(6).max(50).required(),
        password: joi.string().min(6).max(100).required(),
        name: joi.string().min(6).max(100).required(),
        avatar: joi.string(),
        role: joi.string(),
        phone: joi.string().min(6).max(100),
        dob: joi.date().raw(),
    
    })
};

module.exports = schema;