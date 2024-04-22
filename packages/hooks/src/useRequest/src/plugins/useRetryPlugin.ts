import { useRef } from 'react';
import type { Plugin, Timeout } from '../types';

// 重试插件，用于在请求失败时进行重试
const useRetryPlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { retryInterval, retryCount }, // 重试间隔时间和重试次数
) => {
  const timerRef = useRef<Timeout>(); // 计时器引用
  const countRef = useRef(0); // 重试计数器

  const triggerByRetry = useRef(false); // 是否由重试触发的标志

  // 如果没有设置重试次数，则返回空对象
  if (!retryCount) {
    return {};
  }

  return {
    // 请求前的钩子函数
    onBefore: () => {
      // 如果不是由重试触发的请求，则重试计数器归零
      if (!triggerByRetry.current) {
        countRef.current = 0;
      }
      triggerByRetry.current = false; // 重置触发标志

      // 清除之前的计时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    // 请求成功的钩子函数
    onSuccess: () => {
      countRef.current = 0; // 请求成功后重试计数器归零
    },
    // 请求失败的钩子函数
    onError: () => {
      countRef.current += 1; // 重试计数器加一
      // 如果重试次数为 -1（无限重试）或当前重试计数未达到设定的重试次数，则执行重试操作
      if (retryCount === -1 || countRef.current <= retryCount) {
        // 计算重试间隔时间，使用指数增长（Exponential backoff）
        const timeout = retryInterval ?? Math.min(1000 * 2 ** countRef.current, 30000);
        // 设置计时器，在指定的时间后触发重试操作
        timerRef.current = setTimeout(() => {
          triggerByRetry.current = true; // 设置触发标志为 true
          fetchInstance.refresh(); // 执行刷新操作
        }, timeout);
      } else {
        countRef.current = 0; // 重置重试计数器
      }
    },
    // 取消请求的钩子函数
    onCancel: () => {
      countRef.current = 0; // 取消请求后重试计数器归零
      // 清除计时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
  };
};

export default useRetryPlugin; // 导出重试插件
