/**
 * 模拟延迟指定的时间。
 * @param {number} time - 延迟的时间，以毫秒为单位。
 * @returns {Promise<void>} 返回一个 Promise，在延迟结束后 resolve。
 */
export function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * 模拟一个异步请求，返回一个 Promise。
 * @param {any} req - 请求参数。
 * @returns {Promise<string>} 返回一个 Promise，resolve 表示请求成功，reject 表示请求失败。
 */
export function request(req) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (req === 0) {
        reject(new Error('fail'));
      } else {
        resolve('success');
      }
    }, 1000),
  );
}
