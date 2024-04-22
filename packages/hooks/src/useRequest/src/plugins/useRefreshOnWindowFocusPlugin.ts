import { useEffect, useRef } from 'react';
import useUnmount from '../../../useUnmount';
import type { Plugin } from '../types';
import limit from '../utils/limit';
import subscribeFocus from '../utils/subscribeFocus';

// 在窗口焦点变化时刷新插件
const useRefreshOnWindowFocusPlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { refreshOnWindowFocus, focusTimespan = 5000 }, // 是否在窗口焦点变化时刷新及焦点变化的间隔时间，默认为 5000 毫秒
) => {
  const unsubscribeRef = useRef<() => void>(); // 取消订阅的函数引用

  // 停止订阅函数
  const stopSubscribe = () => {
    unsubscribeRef.current?.(); // 如果存在订阅函数，则执行取消订阅操作
  };

  // 副作用：订阅窗口焦点变化事件
  useEffect(() => {
    if (refreshOnWindowFocus) {
      const limitRefresh = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan); // 限制刷新频率的函数
      unsubscribeRef.current = subscribeFocus(() => {
        limitRefresh(); // 在窗口焦点变化时执行限制刷新函数
      });
    }
    // 组件卸载时执行停止订阅函数
    return () => {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]); // 依赖项为 refreshOnWindowFocus 和 focusTimespan

  // 组件卸载时停止订阅
  useUnmount(() => {
    stopSubscribe();
  });

  return {}; // 返回空对象
};

export default useRefreshOnWindowFocusPlugin; // 导出使用窗口焦点刷新插件
