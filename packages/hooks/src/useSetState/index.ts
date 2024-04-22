import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

/**
 * 使用 useState 的方式管理包含多个状态的对象，可以用于更新部分状态或整体状态。
 * @param {S | (() => S)} initialState 初始状态值或者一个返回初始状态的函数。
 * @returns {[S, SetState<S>]} 返回包含当前状态和状态更新函数的元组。
 */
const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  const [state, setState] = useState<S>(initialState); // 使用 useState 钩子保存状态

  // 定义状态更新函数，用于合并更新状态
  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      // 根据传入的参数 patch 的类型进行判断，如果是函数则调用它得到新状态，否则直接使用 patch
      const newState = isFunction(patch) ? patch(prevState) : patch;
      // 如果新状态存在，则将其与旧状态合并，返回新的状态；否则返回旧状态
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState]; // 返回当前状态和状态更新函数的元组
};

export default useSetState; // 导出 useSetState 钩子
