import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import fileupload from 'express-fileupload';

import apiMiddleware from './src/middleware/apiAuth';

import errorHandler from './src/middleware/errorHandler';

import authRoutes from './src/routes/auth.route';
import accountRoutes from './src/routes/account.route';
import todoRoutes from './src/routes/todo.route';

dotenv.config();

/* Connect to MongoDB */
require('./src/models');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

/* Body parser */
app.use(express.json());

/* Cookie parser */
app.use(cookieParser());

app.use(cors());

/* Dev logging middleware */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* File uploading */
app.use(fileupload());

/* Rate limiting */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.use('/api/users', apiMiddleware, accountRoutes);
app.use('/api/todos', apiMiddleware, todoRoutes);

app.use(errorHandler);

module.exports = app;
