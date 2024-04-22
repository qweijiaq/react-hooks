/**
 * 缓存键的类型，可以是字符串或数字。
 */
type CachedKey = string | number;

// 缓存 Promise 的 Map，键为缓存键，值为 Promise 对象
const cachePromise = new Map<CachedKey, Promise<any>>();

/**
 * 获取缓存的 Promise 对象。
 * @param cacheKey 缓存键
 * @returns 返回对应键的缓存 Promise 对象，如果不存在则返回 undefined
 */
const getCachePromise = (cacheKey: CachedKey) => {
  return cachePromise.get(cacheKey); // 获取缓存 Promise
};

/**
 * 设置缓存的 Promise 对象。
 * @param cacheKey 缓存键
 * @param promise 要缓存的 Promise 对象
 */
const setCachePromise = (cacheKey: CachedKey, promise: Promise<any>) => {
  // 缓存相同的 Promise 对象，不能使用 promise.finally
  // 因为 promise.finally 会改变 Promise 对象的引用
  cachePromise.set(cacheKey, promise);

  // 不使用 promise.finally 是为了兼容性
  promise
    .then((res) => {
      cachePromise.delete(cacheKey); // 缓存成功后删除缓存
      return res;
    })
    .catch(() => {
      cachePromise.delete(cacheKey); // 缓存失败后删除缓存
    });
};

export { getCachePromise, setCachePromise }; // 导出缓存 Promise 的方法
