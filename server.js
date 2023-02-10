require('@babel/register');

/* eslint-disable no-console */
const app = require('./app');

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Process ${process.pid} is listening to all incoming requests at port ${process.env.APP_PORT || 3000}`);
});
