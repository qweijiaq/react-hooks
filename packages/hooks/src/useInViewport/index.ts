import 'intersection-observer';
import { useState } from 'react';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type CallbackType = (entry: IntersectionObserverEntry) => void;

export interface Options {
  rootMargin?: string;
  threshold?: number | number[];
  root?: BasicTarget<Element>;
  callback?: CallbackType;
}

/**
 * 自定义 Hook，用于监测目标元素是否在视口内，并提供相关参数配置和回调函数。
 * @param target 目标元素的引用或选择器字符串，可以是单个元素或元素数组
 * @param options 可选项，包含 rootMargin、threshold、root 和 callback 四个属性
 * @returns 返回一个数组，包含两个值：第一个值表示目标元素是否在视口内，第二个值表示目标元素的可见比例
 */
function useInViewport(target: BasicTarget | BasicTarget[], options?: Options) {
  // 从 options 中提取 callback，其余属性作为配置参数传递给 IntersectionObserver
  const { callback, ...option } = options || {};

  // 使用 useState 创建状态值和更新函数，用于表示目标元素是否在视口内和其可见比例
  const [state, setState] = useState<boolean>();
  const [ratio, setRatio] = useState<number>();

  useEffectWithTarget(
    () => {
      // 将目标元素转换为数组形式
      const targets = Array.isArray(target) ? target : [target];
      // 获取目标元素的引用并过滤掉无效元素
      const els = targets.map((element) => getTargetElement(element)).filter(Boolean);

      // 如果目标元素列表为空，则直接返回
      if (!els.length) {
        return;
      }

      // 创建 IntersectionObserver 实例，监测目标元素的可见状态和比例
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // 更新状态值和可见比例，并执行回调函数
            setRatio(entry.intersectionRatio);
            setState(entry.isIntersecting);
            callback?.(entry);
          }
        },
        {
          ...option, // 将配置参数传递给 IntersectionObserver
          root: getTargetElement(options?.root), // 将根元素转换为引用形式
        },
      );

      // 遍历目标元素列表，将每个元素添加到 IntersectionObserver 实例中进行监测
      els.forEach((el) => {
        if (el) {
          // @ts-ignore
          observer.observe(el); // 添加监测目标元素
        }
      });

      // 返回清除 IntersectionObserver 的函数，确保在组件卸载时执行
      return () => {
        observer.disconnect(); // 断开 IntersectionObserver 的连接
      };
    },
    // 当 rootMargin、threshold 或 callback 发生变化时，重新执行 useEffectWithTarget
    [options?.rootMargin, options?.threshold, callback],
    target, // 监听目标元素的变化
  );

  // 返回目标元素是否在视口内的状态值和可见比例
  return [state, ratio] as const;
}

export default useInViewport;
