const exceptionHandler = fn => (...args) => Promise
  .resolve(fn(...args))
  .catch((error) => {
    throw new Error('Request failed due datebase exception');
  });

module.exports = exceptionHandler;
