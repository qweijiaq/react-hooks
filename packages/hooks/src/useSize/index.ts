import ResizeObserver from 'resize-observer-polyfill';
import useRafState from '../useRafState';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useIsomorphicLayoutEffectWithTarget from '../utils/useIsomorphicLayoutEffectWithTarget';

type Size = { width: number; height: number };

/**
 * 用于获取指定目标元素的尺寸信息，支持动态更新。
 * @param {BasicTarget} target 目标元素，可以是 DOM 元素或者 Ref 对象。
 * @returns {Size | undefined} 返回目标元素的尺寸信息，包含宽度和高度，如果目标元素不存在则返回 undefined。
 */
function useSize(target: BasicTarget): Size | undefined {
  // 使用 useRafState 钩子保存尺寸状态，以便在下次渲染前更新
  const [state, setState] = useRafState<Size | undefined>(() => {
    const el = getTargetElement(target);
    // @ts-ignore
    // 如果目标元素存在，则返回其尺寸信息，否则返回 undefined
    return el ? { width: el.clientWidth, height: el.clientHeight } : undefined;
  });

  // 使用 useIsomorphicLayoutEffectWithTarget 钩子监听目标元素尺寸变化
  useIsomorphicLayoutEffectWithTarget(
    () => {
      const el = getTargetElement(target); // 获取目标元素

      if (!el) {
        return;
      }

      // 创建 ResizeObserver 实例，监听目标元素尺寸变化
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target;
          // 更新尺寸状态
          setState({ width: clientWidth, height: clientHeight });
        });
      });
      // @ts-ignore
      resizeObserver.observe(el); // 开始监听目标元素
      return () => {
        resizeObserver.disconnect(); // 组件卸载时停止监听
      };
    },
    [],
    target,
  );

  return state; // 返回目标元素的尺寸信息
}

export default useSize;
