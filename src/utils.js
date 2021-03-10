const asyncInterval = async (callback, ms, triesLeft) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (await callback()) {
        resolve();
        clearInterval(interval);
      } else if (triesLeft !== undefined && triesLeft <= 1) {
        reject();
        clearInterval(interval);
      }
      triesLeft--;
    }, ms);
  });
};

exports.asyncInterval = asyncInterval;
