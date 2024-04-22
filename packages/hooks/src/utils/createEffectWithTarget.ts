import type { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react';
import { useRef } from 'react';
import useUnmount from '../useUnmount';
import depsAreSame from './depsAreSame';
import type { BasicTarget } from './domTarget';
import { getTargetElement } from './domTarget';

/**
 * 创建带有目标的副作用钩子。
 * @param useEffectType 使用的副作用钩子类型，可以是 useEffect 或 useLayoutEffect
 * @returns 返回带有目标的副作用钩子函数
 */
const createEffectWithTarget = (useEffectType: typeof useEffect | typeof useLayoutEffect) => {
  /**
   * 带有目标的副作用钩子。
   * @param effect 要执行的副作用函数
   * @param deps 依赖数组
   * @param target 目标，应该是对比 ref.current vs ref.current、dom vs dom、()=>dom vs ()=>dom
   */
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[],
  ) => {
    // 是否已初始化的标志
    const hasInitRef = useRef(false);

    // 上次目标元素的引用
    const lastElementRef = useRef<(Element | null)[]>([]);
    // 上次依赖数组的引用
    const lastDepsRef = useRef<DependencyList>([]);

    // 卸载时执行的函数引用
    const unLoadRef = useRef<any>();

    useEffectType(() => {
      // 将目标转换为数组
      const targets = Array.isArray(target) ? target : [target];
      // 获取目标元素数组
      const els = targets.map((item) => getTargetElement(item));

      // 初始化执行
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        // 执行副作用函数，并保存返回的清理函数引用
        unLoadRef.current = effect();
        return;
      }

      // 检查目标是否发生变化，若发生变化则重新执行副作用函数
      if (
        els.length !== lastElementRef.current.length ||
        !depsAreSame(els, lastElementRef.current) ||
        !depsAreSame(deps, lastDepsRef.current)
      ) {
        // 执行上次的清理函数
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;

        // 执行新的副作用函数，并保存返回的清理函数引用
        unLoadRef.current = effect();
      }
    });

    // 在组件卸载时执行清理函数
    useUnmount(() => {
      unLoadRef.current?.();
      // 用于 react-refresh
      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

export default createEffectWithTarget;
