const Joi = require('joi');

export const get = {
  params: {
    id: Joi.string().required(),
  },
};

export const remove = {
  params: {
    id: Joi.string().required(),
  },
};

export const update = {
  params: {
    id: Joi.string().required(),
  },
  body: {
    todo: Joi.string(),
    done: Joi.boolean(),
  },
};

export const create = {
  body: {
    todo: Joi.string().required(),
  },
};
