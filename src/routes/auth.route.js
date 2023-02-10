import express from 'express';
import validate from 'express-validation';

import * as authController from '../controllers/auth/auth.controller';
import * as userValidator from '../controllers/auth/auth.validator';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  '/login',
  validate(userValidator.login),
  authController.login,
);

router.post(
  '/verify-login',
  validate(userValidator.verifyLogin),
  authController.verifyLogin,
);

router.get(
  '/logout',
  authController.logout,
);

module.exports = router;
