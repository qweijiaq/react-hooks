import { useEffect, useState } from 'react';
import useThrottleFn from '../useThrottleFn';
import type { ThrottleOptions } from './throttleOptions';

/**
 * 用于对指定的值进行节流处理，减少触发频率。
 * @param {T} value 需要进行节流处理的值。
 * @param {ThrottleOptions} options 节流选项，包括节流等待时间、是否允许首次立即执行、是否允许结束后再执行一次。
 * @returns {T} 返回节流处理后的值。
 */
function useThrottle<T>(value: T, options?: ThrottleOptions) {
  // 使用 useState 钩子保存节流处理后的值
  const [throttled, setThrottled] = useState(value);

  // 使用 useThrottleFn 钩子创建节流函数
  const { run } = useThrottleFn(() => {
    // 当节流函数执行时，更新节流处理后的值
    setThrottled(value);
  }, options);

  // 使用 useEffect 钩子监听值变化并执行节流函数
  useEffect(() => {
    run(); // 执行节流函数
  }, [value]); // 监听值变化

  return throttled; // 返回节流处理后的值
}

export default useThrottle; // 导出 useThrottle 钩子
