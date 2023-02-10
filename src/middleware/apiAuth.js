import { errorResponse } from '../helpers';
import { UserModel } from '../models';

const jwt = require('jsonwebtoken');

const apiAuth = async (req, res, next) => {
  console.log(req.headers['x-token']);
  if (!req.headers && !req.headers['x-token']) {
    return errorResponse(req, res, 'Token is not provided', 401);
  }
  const token = req.headers['x-token'];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user) {
      return errorResponse(req, res, 'User is not found in system', 401);
    }
    if (user.isDelete) {
      return errorResponse(req, res, 'User account deleted', 404);
    }
    req.user = { ...user.toJSON() };
    return next();
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Incorrect token is provided, try re-login',
      401,
    );
  }
};

export default apiAuth;
