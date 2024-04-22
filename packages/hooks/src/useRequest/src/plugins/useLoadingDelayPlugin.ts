import { useRef } from 'react';
import type { Plugin, Timeout } from '../types';

// 加载延迟插件
const useLoadingDelayPlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { loadingDelay, ready }, // 加载延迟参数
) => {
  const timerRef = useRef<Timeout>(); // 定时器的引用

  // 如果 loadingDelay 为假值，则直接返回空对象
  if (!loadingDelay) {
    return {};
  }

  // 取消定时器
  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    // 在请求之前执行的钩子函数
    onBefore: () => {
      cancelTimeout(); // 取消之前的定时器

      // 如果 ready 为假值，则直接返回 loading: false
      if (ready !== false) {
        // 启动定时器，延迟 loading 状态的改变
        timerRef.current = setTimeout(() => {
          fetchInstance.setState({
            loading: true, // 设置 loading 为 true，表示加载中
          });
        }, loadingDelay);
      }

      return {
        loading: false, // 返回 loading: false，表示暂时不加载
      };
    },
    // 请求结束时执行的钩子函数
    onFinally: () => {
      cancelTimeout(); // 取消定时器
    },
    // 取消请求时执行的钩子函数
    onCancel: () => {
      cancelTimeout(); // 取消定时器
    },
  };
};

export default useLoadingDelayPlugin;

