import path from 'path';
import { debug } from 'console';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import * as userService from '../../services/user.service';

import {
  successResponse,
  errorResponse,
  sendEmail,
} from '../../helpers';

import asyncHandler from '../../middleware/async';

// @desc      Get Profile
// @route     GET /api/users
// @access    Private/User
export const profile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userService.getUser({ _id }, []);
  user.profile = user.profile && `${req.protocol}://${req.get('host')}/uploads/${user.profile}`;
  return successResponse(req, res, user);
});

/**
 * Todo Add Update email controller
 */

// @desc      Update user
// @route     PUT /api/users
// @access    Private/User
export const updateUser = asyncHandler(async (req, res, next) => {
  const {
    name,
    address,
  } = req.body;

  const { _id } = req.user;

  const user = await userService.getUser({ _id });

  user.name = name || user.name;
  user.address = address || user.address;

  await user.save();

  return successResponse(req, res, user);
});

// @desc      Update Email
// @route     PUT /api/users/email
// @access    Private/User
export const updateEmail = asyncHandler(async (req, res, next) => {
  const {
    email,
  } = req.body;

  const { _id, email: userEmail } = req.user;
  if (userEmail === email) {
    return errorResponse(req, res, 'New email is same as existing');
  }

  const user = await userService.getUser({ _id: { $ne: _id }, email });
  console.log(user);
  if (user) {
    return errorResponse(req, res, 'Email is already in use by someone else');
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await userService.updateUser(_id, { verifyEmailCode: otp });

  const confirmEmailToken = jwt.sign({ _id, email, verifyEmailCode: otp }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const confirmEmailURL = `${req.protocol}://${req.get(
    'host',
  )}/api/users/verify-email?token=${confirmEmailToken}`;

  const message = `You are receiving this email because you need to confirm your new email address. Please make a PUT request to: \n\n ${confirmEmailURL}`;

  await sendEmail({
    email,
    subject: 'Email confirmation token',
    message,
  });
  return successResponse(req, res, 'Email sent', 200);
});

// @desc      Verify new email
// @route     GET /api/users/verify-email
// @access    Private/User
export const verifyNewEmail = asyncHandler(async (req, res, next) => {
  const {
    token,
  } = req.query;

  const { _id, verifyEmailCode } = req.user;

  const {
    _id: tokenId,
    email: tokenEmail,
    verifyEmailCode: tokenCode,
  } = await jwt.verify(token, process.env.JWT_SECRET);

  if (!tokenId || !tokenEmail || !tokenCode) {
    return errorResponse(req, res, 'Invalid token', 401);
  }

  if (
    Number(verifyEmailCode) !== Number(tokenCode)
    || tokenId.toString() !== _id.toString()
  ) {
    return errorResponse(req, res, 'Invalid token', 401);
  }

  await userService.updateUser(_id, { email: tokenEmail, $unset: { verifyEmailCode: 1 } });

  return successResponse(req, res, 'Email successfully updated');
});

// @desc      Delete user
// @route     DELETE /api/users
// @access    Private/User
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  await userService.deleteUser(_id);
  return successResponse(req, res, {});
});

// @desc      Update Profile photo
// @route     PUT /api/users/photo
// @access    Private/User
export const photoUpload = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userService.getUser({ _id });

  if (!user) {
    return errorResponse(req, res, `user not found with id of ${_id}`, 404);
  }

  if (!req.files) {
    return errorResponse(req, res, 'Please upload a file', 400);
  }

  const { file } = req.files;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return errorResponse(req, res, 'Please upload an image file', 400);
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return errorResponse(
      req,
      res,
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      400,
    );
  }
  // Create custom filename
  file.name = `profile_${_id}_${Date.now()}_${path.parse(file.name).ext}`;

  if (user.profile) {
    const filePath = path.join(`${process.env.FILE_UPLOAD_PATH}`, user.profile);
    fs.unlinkSync(filePath);
  }
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      debug(err);
      return errorResponse(req, res, 'Problem with file upload', 500);
    }

    user.profile = file.name;
    await user.save();
    return successResponse(req, res, file.name);
  });
});
