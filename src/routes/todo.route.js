import express from 'express';
import validate from 'express-validation';

import * as todoController from '../controllers/todo/todo.controller';
import * as todoValidator from '../controllers/todo/todo.validator';

const router = express.Router();

//= ===============================
// API routes
//= ===============================

router.get('/', todoController.list);

router.delete('/:id', validate(todoValidator.remove), todoController.remove);

router.get('/:id', validate(todoValidator.get), todoController.get);

router.put('/:id', validate(todoValidator.update), todoController.update);
router.post('/', validate(todoValidator.create), todoController.create);

module.exports = router;
