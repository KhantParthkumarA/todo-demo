import { UserModel } from '../../models';
import asyncHandler from '../../middleware/async';
import * as userService from '../../services/user.service';

import {
  sendEmail,
  errorResponse,
  successResponse,
} from '../../helpers';

export const sendTokenResponse = (user, statusCode, req, res) => {
  /* Create token */
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('token', token, options);

  return successResponse(req, res, {
    token,
  }, statusCode);
};

// @desc      Login
// @route     POST /api/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  /* Check for user */
  let user = await UserModel.findOne(
    { email },
  ).select([]);

  if (user && user.isDelete) {
    return errorResponse(req, res, 'Account Deleted', 404);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  if (!user) {
    const newUser = await userService.createUser({
      email,
      otp,
    });
    if (!newUser._id) {
      return errorResponse(req, res, 'User could not be created', 400);
    }
    user = newUser;
  } else if (user && email) {
    await userService.updateUser(user._id, {
      otp,
    });
  }

  const message = `You are receiving this email because you (or someone else) has requested the todo app login. Please use this code to verify your login ${otp}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Verification Code',
      message,
    });
    return successResponse(req, res, 'Email sent');
  } catch (err) {
    return errorResponse(req, res, 'Email could not be sent');
  }
});

// @desc      Verify Login
// @route     POST /api/auth/verifylogin
// @access    Public
export const verifyLogin = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  /* Check for user */
  const user = await UserModel.findOne(
    { email },
  ).select([]);

  if (!user) {
    return errorResponse(req, res, 'User does not exist', 404);
  }

  if (user && user.isDelete) {
    return errorResponse(req, res, 'Account Deleted', 404);
  }
  console.log(typeof user.otp, typeof otp);
  if (user.otp !== otp) {
    return errorResponse(req, res, 'Invalid otp', 401);
  }

  await userService.updateUser(user._id, {
    $unset: { otp: 1 },
  });
  return sendTokenResponse(user, 200, req, res);

});

// @desc      Logout and clear cookies
// @route     GET /api/auth/logout
// @access    Public
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return successResponse(req, res, {});
});
