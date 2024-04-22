import { debounce } from '../utils/lodash-polyfill';
import { useMemo } from 'react';
import type { DebounceOptions } from '../useDebounce/debounceOptions';
import useLatest from '../useLatest';
import useUnmount from '../useUnmount';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (...args: any[]) => any;

/**
 * 使用防抖功能包装函数的自定义 Hook
 * @param fn 需要进行防抖处理的函数
 * @param options 防抖函数的配置选项
 * @returns 包装后的防抖函数和其相关方法
 */
function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  // 在开发环境下，检查传入的参数是否为函数，如果不是，则打印错误信息
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useDebounceFn 期望的参数是一个函数，但得到的是 ${typeof fn}`);
    }
  }

  // 使用 useLatest Hook 来获取函数的最新版本
  const fnRef = useLatest(fn);

  // 获取防抖的等待时间，默认为 1000 毫秒
  const wait = options?.wait ?? 1000;

  // 使用 useMemo Hook 创建防抖函数
  const debounced = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options,
      ),
    [],
  );

  // 使用 useUnmount Hook 在组件卸载时取消防抖函数
  useUnmount(() => {
    debounced.cancel();
  });

  // 返回包装后的防抖函数及其相关方法
  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;
