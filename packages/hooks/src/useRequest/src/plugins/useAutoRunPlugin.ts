import { useRef } from 'react';
import useUpdateEffect from '../../../useUpdateEffect';
import type { Plugin } from '../types';

// 支持 refreshDeps & ready
const useAutoRunPlugin: Plugin<any, any[]> = (
  fetchInstance, // Fetch 实例
  { manual, ready = true, defaultParams = [], refreshDeps = [], refreshDepsAction }, // 配置参数对象
) => {
  const hasAutoRun = useRef(false); // 用于跟踪是否已经自动运行过
  hasAutoRun.current = false;

  // 当 ready 状态改变时自动运行
  useUpdateEffect(() => {
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run(...defaultParams);
    }
  }, [ready]);

  // 当 refreshDeps 中的依赖项发生变化时自动运行
  useUpdateEffect(() => {
    // 如果已经自动运行过，则不再重复执行
    if (hasAutoRun.current) {
      return;
    }
    if (!manual) {
      hasAutoRun.current = true;
      // 如果存在 refreshDepsAction，则执行该函数；否则执行 fetchInstance 的 refresh 方法
      if (refreshDepsAction) {
        refreshDepsAction();
      } else {
        fetchInstance.refresh();
      }
    }
  }, [...refreshDeps]);

  // 返回一个对象，用于在请求前进行处理
  return {
    onBefore: () => {
      // 如果 ready 状态为 false，则立即停止请求
      if (!ready) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

// 初始化时配置加载状态
useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: !manual && ready,
  };
};

export default useAutoRunPlugin;
