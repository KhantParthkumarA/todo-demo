
import dotenv from 'dotenv';

require('colors');
const mongoose = require('mongoose');

dotenv.config();

const UserModel = require('./user.model');
const TodoModel = require('./todo.model');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};
connectDB();

export {
  connectDB,
  UserModel,
  TodoModel,
};
