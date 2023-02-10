import * as todoService from '../../services/todo.service';

import {
  successResponse,
} from '../../helpers';

import asyncHandler from '../../middleware/async';

// @desc      Create todo
// @route     POST /api/todos
// @access    Private/User
export const create = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const todo = await todoService.create(
    { userId: _id, todo: req.body.todo },
    [],
  );

  return successResponse(req, res, todo);
});

// @desc      Get todo
// @route     GET /api/todos/:id
// @access    Private/User
export const get = asyncHandler(async (req, res, next) => {
  const todo = await todoService.get(
    { _id: req.params.id },
    [],
  );
  return successResponse(req, res, todo);
});

// @desc      List todos
// @route     GET /api/todos
// @access    Private/User
export const list = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const todo = await todoService.list(
    { userId: _id },
    [],
  );
  return successResponse(req, res, todo);
});

// @desc      Update todo
// @route     PUT /api/todos/:id
// @access    Private/User
export const update = asyncHandler(async (req, res, next) => {
  const {
    todo,
    done,
  } = req.body;

  const { _id } = req.user;
  const { id } = req.params;

  const todoDetails = await todoService.get({ _id: id, userId: _id });

  todoDetails.todo = todo || todoDetails.todo;
  todoDetails.done = typeof done === 'boolean' ? done : todoDetails.done;

  await todoDetails.save();

  return successResponse(req, res, todoDetails);
});

// @desc      Delete todo
// @route     DELETE /api/todos/:id
// @access    Private/User
export const remove = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  await todoService.remove({ _id: id, userId: _id });
  return successResponse(req, res, {});
});
