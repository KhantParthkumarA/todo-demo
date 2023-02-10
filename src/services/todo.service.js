import { TodoModel } from '../models';
import exceptionHandler from '../middleware/exceptionHandler';

export const get = exceptionHandler(async (
  query,
  select = [],
) => {
  const todo = await TodoModel.findOne(query).select(select);
  return todo;
});

export const list = exceptionHandler(async (
  query,
  select = [],
) => {
  const todos = await TodoModel.find(query).select(select);
  return todos;
});

export const create = exceptionHandler(async (payload) => {
  const todo = await TodoModel.create(payload);
  return todo;
});

export const update = exceptionHandler(async (
  query, payload, options = { new: true, runValidators: true },
) => {
  const todo = await TodoModel.findOneAndUpdate(query, payload, options);
  return todo;
});

export const remove = exceptionHandler(async (query) => {
  const todo = await TodoModel.findOneAndDelete(query);
  return todo;
});
