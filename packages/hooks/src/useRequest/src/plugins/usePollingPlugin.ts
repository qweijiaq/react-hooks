import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import type { Plugin, Timeout } from '../types';
import isDocumentVisible from '../utils/isDocumentVisible';
import subscribeReVisible from '../utils/subscribeReVisible';

// 轮询插件
const usePollingPlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  {
    pollingInterval, // 轮询间隔时间
    pollingWhenHidden = true, // 当页面隐藏时是否继续轮询，默认为 true
    pollingErrorRetryCount = -1, // 轮询错误重试次数，默认为 -1，表示无限重试
  },
) => {
  const timerRef = useRef<Timeout>(); // 定时器的引用
  const unsubscribeRef = useRef<() => void>(); // 取消订阅的函数引用
  const countRef = useRef<number>(0); // 错误计数器

  // 停止轮询
  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    unsubscribeRef.current?.(); // 取消订阅
  };

  // 在轮询间隔时间变化时执行的副作用
  useUpdateEffect(() => {
    if (!pollingInterval) {
      stopPolling(); // 如果轮询间隔时间为假值，则停止轮询
    }
  }, [pollingInterval]);

  // 如果轮询间隔时间为假值，则直接返回空对象
  if (!pollingInterval) {
    return {};
  }

  return {
    // 在请求之前执行的钩子函数
    onBefore: () => {
      stopPolling(); // 在请求之前停止轮询
    },
    // 在请求错误时执行的钩子函数
    onError: () => {
      countRef.current += 1; // 错误计数加一
    },
    // 在请求成功时执行的钩子函数
    onSuccess: () => {
      countRef.current = 0; // 重置错误计数
    },
    // 在请求结束时执行的钩子函数
    onFinally: () => {
      if (
        pollingErrorRetryCount === -1 || // 如果轮询错误重试次数为 -1（无限重试）
        (pollingErrorRetryCount !== -1 && countRef.current <= pollingErrorRetryCount) // 或错误计数未达到重试次数限制
      ) {
        timerRef.current = setTimeout(() => {
          // 如果页面隐藏且不继续轮询时，则停止轮询并订阅页面可见性改变事件
          if (!pollingWhenHidden && !isDocumentVisible()) {
            unsubscribeRef.current = subscribeReVisible(() => {
              fetchInstance.refresh(); // 当页面重新可见时刷新数据
            });
          } else {
            fetchInstance.refresh(); // 否则直接刷新数据
          }
        }, pollingInterval); // 根据轮询间隔时间设置定时器
      } else {
        countRef.current = 0; // 重置错误计数
      }
    },
    // 在取消请求时执行的钩子函数
    onCancel: () => {
      stopPolling(); // 取消轮询
    },
  };
};

export default usePollingPlugin;
