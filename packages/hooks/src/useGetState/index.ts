import type { Dispatch, SetStateAction } from 'react';
import { useState, useRef, useCallback } from 'react';

type GetStateAction<S> = () => S;

/**
 * 自定义 Hook，用于在函数组件中获取状态值并提供获取状态的函数。
 * @param initialState 初始状态值或状态值的初始化函数
 * @returns 返回包含当前状态值、状态更新函数和获取状态的函数的数组
 */
function useGetState<S>(
  initialState: S | (() => S), // 可选参数：初始状态值或状态值的初始化函数
): [S, Dispatch<SetStateAction<S>>, GetStateAction<S>]; // 返回值类型定义：包含当前状态值、状态更新函数和获取状态的函数的数组
/**
 * 自定义 Hook，用于在函数组件中获取状态值并提供获取状态的函数。
 * @returns 返回包含当前状态值、状态更新函数和获取状态的函数的数组
 */
function useGetState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  GetStateAction<S | undefined>,
]; // 返回值类型定义：包含当前状态值、状态更新函数和获取状态的函数的数组
/**
 * 自定义 Hook，用于在函数组件中获取状态值并提供获取状态的函数。
 * @param initialState 初始状态值或状态值的初始化函数
 */
function useGetState<S>(initialState?: S) {
  // 使用 useState Hook 创建状态及其更新函数
  const [state, setState] = useState(initialState);
  // 使用 useRef Hook 创建保存状态值的引用
  const stateRef = useRef(state);
  // 将状态值保存在 ref 中，以便在 getState 函数中获取最新状态
  stateRef.current = state;

  // 定义获取状态的函数
  const getState = useCallback(() => stateRef.current, []);

  // 返回当前状态值、状态更新函数和获取状态的函数组成的数组
  return [state, setState, getState];
}

export default useGetState;
