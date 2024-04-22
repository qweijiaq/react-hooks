import { useRef } from 'react';
import useCreation from '../../../useCreation';
import useUnmount from '../../../useUnmount';
import type { Plugin } from '../types';
import { setCache, getCache } from '../utils/cache';
import type { CachedData } from '../utils/cache';
import { setCachePromise, getCachePromise } from '../utils/cachePromise';
import { trigger, subscribe } from '../utils/cacheSubscribe';

// 缓存插件
const useCachePlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  {
    cacheKey, // 缓存键
    cacheTime = 5 * 60 * 1000, // 缓存时间，默认5分钟
    staleTime = 0, // 过期时间，默认为0，即不过期
    setCache: customSetCache, // 自定义设置缓存函数
    getCache: customGetCache, // 自定义获取缓存函数
  },
) => {
  const unSubscribeRef = useRef<() => void>(); // 取消订阅函数的引用
  const currentPromiseRef = useRef<Promise<any>>(); // 当前 promise 的引用

  // 设置缓存
  const _setCache = (key: string, cachedData: CachedData) => {
    if (customSetCache) {
      customSetCache(cachedData); // 使用自定义设置缓存函数
    } else {
      setCache(key, cacheTime, cachedData); // 使用默认设置缓存函数
    }
    trigger(key, cachedData.data); // 触发缓存更新
  };

  // 获取缓存
  const _getCache = (key: string, params: any[] = []) => {
    if (customGetCache) {
      return customGetCache(params); // 使用自定义获取缓存函数
    }
    return getCache(key); // 使用默认获取缓存函数
  };

  // 初始化
  useCreation(() => {
    if (!cacheKey) {
      return;
    }

    // 从缓存中获取数据
    const cacheData = _getCache(cacheKey);
    if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
      fetchInstance.state.data = cacheData.data;
      fetchInstance.state.params = cacheData.params;
      // 如果数据仍然新鲜，则设置 loading 为 false
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        fetchInstance.state.loading = false;
      }
    }

    // 订阅相同缓存键的更新事件，触发更新
    unSubscribeRef.current = subscribe(cacheKey, (data) => {
      fetchInstance.setState({ data });
    });
  }, []);

  // 组件卸载时取消订阅
  useUnmount(() => {
    unSubscribeRef.current?.();
  });

  // 如果缓存键不存在，则直接返回空对象
  if (!cacheKey) {
    return {};
  }

  // 返回插件的各个钩子函数
  return {
    // 在请求前的处理逻辑
    onBefore: (params) => {
      const cacheData = _getCache(cacheKey, params);

      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        return {}; // 如果缓存中不存在数据，则不进行任何处理
      }

      // 如果数据仍然新鲜，则停止请求，直接返回缓存数据
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        return {
          loading: false,
          data: cacheData?.data,
          error: undefined,
          returnNow: true,
        };
      } else {
        // 如果数据已过期，则返回缓存数据，同时继续发起请求
        return {
          data: cacheData?.data,
          error: undefined,
        };
      }
    },
    // 在请求发起前的处理逻辑
    onRequest: (service, args) => {
      let servicePromise = getCachePromise(cacheKey);

      // 如果存在 servicePromise，并且不是由自身触发的，则直接使用该 promise
      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return { servicePromise };
      }

      // 否则，发起请求并将请求的 promise 缓存起来
      servicePromise = service(...args);
      currentPromiseRef.current = servicePromise;
      setCachePromise(cacheKey, servicePromise);
      return { servicePromise };
    },
    // 请求成功后的处理逻辑
    onSuccess: (data, params) => {
      if (cacheKey) {
        // 取消订阅，避免触发自身
        unSubscribeRef.current?.();
        // 更新缓存数据
        _setCache(cacheKey, {
          data,
          params,
          time: new Date().getTime(),
        });
        // 重新订阅
        unSubscribeRef.current = subscribe(cacheKey, (d) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
    // 数据变更时的处理逻辑
    onMutate: (data) => {
      if (cacheKey) {
        // 取消订阅，避免触发自身
        unSubscribeRef.current?.();
        // 更新缓存数据
        _setCache(cacheKey, {
          data,
          params: fetchInstance.state.params,
          time: new Date().getTime(),
        });
        // 重新订阅
        unSubscribeRef.current = subscribe(cacheKey, (d) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
  };
};

export default useCachePlugin;
