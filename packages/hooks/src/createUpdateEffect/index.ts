import { useRef } from 'react';
import type { useEffect, useLayoutEffect } from 'react';

// 定义 EffectHookType 类型，用于表示 useEffect 或 useLayoutEffect
type EffectHookType = typeof useEffect | typeof useLayoutEffect;

/**
 * 创建更新副作用钩子
 * @param {EffectHookType} hook useEffect 或 useLayoutEffect 钩子
 * @returns {EffectHookType} 创建的更新副作用钩子
 */
export const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
  (hook) => (effect, deps) => {
    const isMounted = useRef(false); // 使用 useRef 创建状态，用于表示组件是否已挂载

    // 为 react-refresh 提供支持，设置组件卸载时的回调函数
    hook(() => {
      return () => {
        isMounted.current = false; // 将组件已挂载状态设置为 false
      };
    }, []);

    hook(() => {
      if (!isMounted.current) {
        // 如果组件未挂载
        isMounted.current = true; // 将组件已挂载状态设置为 true
      } else {
        // 如果组件已挂载
        return effect(); // 执行副作用函数
      }
    }, deps); // 依赖数组
  };

export default createUpdateEffect; // 导出创建更新副作用钩子函数
