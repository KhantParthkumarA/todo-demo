import { UserModel } from '../models';
import exceptionHandler from '../middleware/exceptionHandler';

export const getUser = exceptionHandler(async (
  query,
  select = [],
) => {
  const user = await UserModel.findOne(query).select(select);
  return user;
});

export const createUser = exceptionHandler(async (payload) => {
  const user = await UserModel.create(payload);
  return user;
});

export const updateUser = exceptionHandler(async (
  id, payload, options = { new: true, runValidators: true },
) => {
  const user = await UserModel.findByIdAndUpdate(id, payload, options);
  return user;
});

export const deleteUser = exceptionHandler(async (id) => {
  const user = await UserModel.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  return user;
});
