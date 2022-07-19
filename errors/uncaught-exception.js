const handleUncaughtException = (err, origin) => {
  console.log(`${origin} ${err.name} with text ${err.message} doesn't catch. Look at this!`);
};

module.exports = handleUncaughtException;
