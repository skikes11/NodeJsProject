const joi = require("joi");

const schema = { 
    user : joi.object({
      username: joi.string().min(6).max(100).required(),
      password: joi.string().min(6).max(100).required(),
      name: joi.string().min(6).max(100).required(),
      phone: joi.string().min(6).max(100),
      dob: joi.date().raw(),
      email: joi.string().email()
    })
};

module.exports = schema;