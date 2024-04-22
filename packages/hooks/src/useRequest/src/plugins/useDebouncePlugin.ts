import type { DebouncedFunc, DebounceSettings } from 'lodash-es';
import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';
import type { Plugin } from '../types';

// 防抖插件
const useDebouncePlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait }, // 防抖参数
) => {
  const debouncedRef = useRef<DebouncedFunc<any>>(); // 防抖函数的引用

  const options = useMemo(() => {
    const ret: DebounceSettings = {};
    if (debounceLeading !== undefined) {
      ret.leading = debounceLeading; // 是否允许立即执行一次
    }
    if (debounceTrailing !== undefined) {
      ret.trailing = debounceTrailing; // 是否允许延迟执行
    }
    if (debounceMaxWait !== undefined) {
      ret.maxWait = debounceMaxWait; // 最大等待时间
    }
    return ret;
  }, [debounceLeading, debounceTrailing, debounceMaxWait]);

  // 当 debounceWait 发生变化时，重新设置防抖函数
  useEffect(() => {
    if (debounceWait) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

      // 创建防抖函数
      debouncedRef.current = debounce(
        (callback) => {
          callback();
        },
        debounceWait,
        options,
      );

      // 重写 runAsync 方法，使其支持防抖
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debouncedRef.current?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject);
          });
        });
      };

      // 组件卸载时取消防抖
      return () => {
        debouncedRef.current?.cancel();
        fetchInstance.runAsync = _originRunAsync;
      };
    }
  }, [debounceWait, options]);

  // 如果 debounceWait 为假值，则直接返回空对象
  if (!debounceWait) {
    return {};
  }

  // 返回 onCancel 方法，用于手动取消防抖
  return {
    onCancel: () => {
      debouncedRef.current?.cancel(); // 取消防抖
    },
  };
};

export default useDebouncePlugin;
