import { getTargetElement } from '../utils/domTarget';
import type { BasicTarget } from '../utils/domTarget';
import useDeepCompareEffectWithTarget from '../utils/useDeepCompareWithTarget';
import useLatest from '../useLatest';

/**
 * 自定义 Hook，用于监听指定目标元素上的 DOM 变动，并执行回调函数。
 * @param callback DOM 变动发生时执行的回调函数
 * @param target 目标元素的选择器
 * @param options MutationObserver 的配置选项，可选，默认为空对象
 */
const useMutationObserver = (
  callback: MutationCallback, // DOM 变动发生时执行的回调函数
  target: BasicTarget, // 目标元素的选择器
  options: MutationObserverInit = {}, // MutationObserver 的配置选项，可选，默认为空对象
): void => {
  const callbackRef = useLatest(callback); // 使用 useLatest Hook 缓存回调函数

  // 使用 useDeepCompareEffectWithTarget Hook 监听目标元素上的 DOM 变动
  useDeepCompareEffectWithTarget(
    () => {
      // 获取目标元素
      const element = getTargetElement(target);
      if (!element) {
        return;
      }
      // 创建 MutationObserver 实例
      const observer = new MutationObserver(callbackRef.current);
      // 开始观察目标元素的 DOM 变动
      // @ts-ignore
      observer.observe(element, options);
      // 返回清理函数，用于在组件卸载时停止观察
      return () => {
        observer?.disconnect();
      };
    },
    [options], // 监听选项的变化以重新创建 MutationObserver 实例
    target, // 监听目标元素的变化以重新创建 MutationObserver 实例
  );
};

export default useMutationObserver;
