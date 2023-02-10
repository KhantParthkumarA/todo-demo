import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/account/account.controller';
import * as userValidator from '../controllers/account/account.validator';

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get('/', userController.profile);
router.delete('/', userController.deleteUser);

router.put('/', validate(userValidator.updateUser), userController.updateUser);

router.put('/photo', validate(userValidator.uploadPhoto), userController.photoUpload);

router.put('/email', validate(userValidator.updateEmail), userController.updateEmail);
router.put('/verify-email', userController.verifyNewEmail);

module.exports = router;
