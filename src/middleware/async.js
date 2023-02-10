import { errorResponse } from '../helpers';

const asyncHandler = fn => (req, res, next) => Promise
  .resolve(fn(req, res, next))
  .catch(function (error) {
    return errorResponse(req, res, error.message, 500);
  });

module.exports = asyncHandler;
