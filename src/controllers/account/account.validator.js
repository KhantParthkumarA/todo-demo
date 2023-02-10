const Joi = require('joi');

export const getOtherUserProfile = {
  body: {
    userId: Joi.number().required(),
  },
};

export const deleteUser = {
  params: {
    id: Joi.number().required(),
  },
};

export const uploadPhoto = {
  files: Joi.object({
    file: Joi.string().required(),
  }),
};

export const updateUser = {
  body: {
    name: Joi.string(),
    address: Joi.string(),
  },
};

export const updateEmail = {
  body: {
    email: Joi.string().email().required(),
  },
};
