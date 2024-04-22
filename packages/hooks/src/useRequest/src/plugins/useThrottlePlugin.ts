import type { DebouncedFunc, ThrottleSettings } from 'lodash-es';
import { throttle } from 'lodash-es';
import { useEffect, useRef } from 'react';
import type { Plugin } from '../types';

// 节流插件，用于控制请求的触发频率
const useThrottlePlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { throttleWait, throttleLeading, throttleTrailing }, // 节流等待时间、是否立即执行首次回调、是否在节流结束后执行回调
) => {
  const throttledRef = useRef<DebouncedFunc<any>>(); // 节流函数引用

  const options: ThrottleSettings = {}; // 节流选项
  if (throttleLeading !== undefined) {
    options.leading = throttleLeading; // 设置是否立即执行首次回调
  }
  if (throttleTrailing !== undefined) {
    options.trailing = throttleTrailing; // 设置是否在节流结束后执行回调
  }

  useEffect(() => {
    if (throttleWait) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance); // 原始的异步执行函数引用

      // 创建节流函数
      throttledRef.current = throttle(
        (callback) => {
          callback(); // 执行回调函数
        },
        throttleWait, // 设置节流等待时间
        options, // 设置节流选项
      );

      // 重写 Fetch 实例的异步执行函数，实现节流效果
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttledRef.current?.(() => {
            _originRunAsync(...args) // 执行原始的异步执行函数
              .then(resolve) // 成功时执行 resolve
              .catch(reject); // 失败时执行 reject
          });
        });
      };

      // 组件卸载时恢复原始的异步执行函数并取消节流函数
      return () => {
        fetchInstance.runAsync = _originRunAsync; // 恢复原始的异步执行函数
        throttledRef.current?.cancel(); // 取消节流函数
      };
    }
  }, [throttleWait, throttleLeading, throttleTrailing]); // useEffect 依赖项

  // 如果节流等待时间为 0 或未设置，则返回空对象
  if (!throttleWait) {
    return {};
  }

  // 返回节流插件钩子函数
  return {
    // 取消请求时取消节流函数
    onCancel: () => {
      throttledRef.current?.cancel(); // 取消节流函数
    },
  };
};

export default useThrottlePlugin; // 导出节流插件
