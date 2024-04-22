type Timer = ReturnType<typeof setTimeout>;
type CachedKey = string | number;

/**
 * 缓存的数据类型，包含数据本身、参数以及缓存时间戳。
 * @template TData 缓存的数据类型，默认为 any
 * @template TParams 请求的参数类型，默认为 any
 */
export interface CachedData<TData = any, TParams = any> {
  data: TData; // 缓存的数据
  params: TParams; // 请求的参数
  time: number; // 缓存时间戳
}

/**
 * 记录缓存数据的类型，包含缓存数据本身以及对应的定时器。
 */
interface RecordData extends CachedData {
  timer: Timer | undefined; // 定时器，用于定时清除缓存
}

// 缓存数据的 Map，键为缓存键，值为记录数据的对象
const cache = new Map<CachedKey, RecordData>();

/**
 * 设置缓存的方法。
 * @param key 缓存键
 * @param cacheTime 缓存时间，单位为毫秒，-1 表示永久缓存
 * @param cachedData 缓存的数据对象
 */
const setCache = (key: CachedKey, cacheTime: number, cachedData: CachedData) => {
  const currentCache = cache.get(key); // 获取当前缓存
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer); // 清除当前缓存对应的定时器
  }

  let timer: Timer | undefined = undefined; // 初始化定时器

  if (cacheTime > -1) {
    // 如果设置了缓存时间，则创建定时器，在过期后清除缓存
    timer = setTimeout(() => {
      cache.delete(key); // 清除缓存
    }, cacheTime);
  }

  // 将缓存数据和定时器记录存入缓存 Map 中
  cache.set(key, {
    ...cachedData,
    timer,
  });
};

/**
 * 获取缓存的方法。
 * @param key 缓存键
 * @returns 返回对应键的缓存数据，如果不存在则返回 undefined
 */
const getCache = (key: CachedKey) => {
  return cache.get(key); // 获取缓存数据
};

/**
 * 清除缓存的方法。
 * @param key 要清除的缓存键，可以是单个键或键数组，如果不传参数，则清空所有缓存
 */
const clearCache = (key?: string | string[]) => {
  if (key) {
    const cacheKeys = Array.isArray(key) ? key : [key]; // 将参数转换为数组
    cacheKeys.forEach((cacheKey) => cache.delete(cacheKey)); // 遍历删除对应键的缓存
  } else {
    cache.clear(); // 清空所有缓存
  }
};

export { getCache, setCache, clearCache }; // 导出缓存操作的方法
