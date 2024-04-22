import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useUnmountedRef from '../useUnmountedRef';

/**
 * 安全地使用状态钩子，可在组件卸载后阻止状态更新。
 * @template S 状态类型
 * @param {S | (() => S)} [initialState] 初始状态值或状态初始化函数
 * @returns {[S | undefined, Dispatch<SetStateAction<S | undefined>>]} 返回当前状态值和更新状态的函数
 */
function useSafeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];

/**
 * 安全地使用状态钩子，可在组件卸载后阻止状态更新。
 * @template S 默认为 undefined 的状态类型
 * @returns {[S | undefined, Dispatch<SetStateAction<S | undefined>>]} 返回当前状态值和更新状态的函数
 */
function useSafeState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

function useSafeState<S>(initialState?: S | (() => S)) {
  const unmountedRef = useUnmountedRef(); // 获取组件是否已卸载的引用
  const [state, setState] = useState(initialState); // 使用状态钩子获取状态和更新状态的函数
  // 定义安全的状态更新函数，如果组件已卸载，则停止更新状态
  const setCurrentState = useCallback((currentState) => {
    /** if component is unmounted, stop update */
    if (unmountedRef.current) return;
    setState(currentState); // 更新状态
  }, []);

  return [state, setCurrentState] as const; // 返回当前状态值和安全的状态更新函数
}

export default useSafeState; // 导出安全状态钩子
