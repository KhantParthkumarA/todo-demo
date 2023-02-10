const Joi = require('joi');

export const login = {
  body: {
    email: Joi.string().email().required(),
  },
};

export const verifyLogin = {
  body: {
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  },
};
