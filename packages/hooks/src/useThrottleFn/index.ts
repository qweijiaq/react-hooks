import { throttle } from 'lodash-es';
import { useMemo } from 'react';
import useLatest from '../useLatest';
import type { ThrottleOptions } from '../useThrottle/throttleOptions';
import useUnmount from '../useUnmount';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (...args: any[]) => any;

/**
 * 用于创建一个节流函数，对传入的函数进行节流处理。
 * @param {T} fn 需要进行节流处理的函数。
 * @param {ThrottleOptions} options 节流选项，包括节流等待时间、是否允许首次立即执行、是否允许结束后再执行一次。
 * @returns {{ run: T; cancel: () => void; flush: () => void; }} 返回一个对象，包含运行节流函数、取消节流函数、立即执行节流函数的方法。
 */
function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions) {
  // 如果是开发环境，并且传入的参数不是函数，则打印错误信息
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useThrottleFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 使用 useLatest 钩子创建函数的最新引用
  const fnRef = useLatest(fn);

  // 获取节流等待时间，默认为 1000ms
  const wait = options?.wait ?? 1000;

  // 使用 useMemo 钩子创建节流函数
  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args); // 调用函数的最新引用
        },
        wait,
        options,
      ),
    [],
  );

  // 在组件卸载时取消节流函数
  useUnmount(() => {
    throttled.cancel();
  });

  // 返回包含运行节流函数、取消节流函数、立即执行节流函数的方法的对象
  return {
    run: throttled, // 运行节流函数
    cancel: throttled.cancel, // 取消节流函数
    flush: throttled.flush, // 立即执行节流函数
  };
}

export default useThrottleFn; // 导出 useThrottleFn 钩子
