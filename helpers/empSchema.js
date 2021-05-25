const Joi = require("joi");

// validation for request body of employee post request
module.exports = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  socialSecurityNumber: Joi.string().required(),
});
