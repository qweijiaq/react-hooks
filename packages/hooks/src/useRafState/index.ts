import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useUnmount from '../useUnmount';

function useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useRafState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

/**
 * 自定义 Hook，使用 requestAnimationFrame 来延迟更新状态，以确保在下一帧渲染时更新状态。
 * @param initialState 初始状态值或者一个返回初始状态值的函数
 * @returns 返回一个状态值和一个用于更新状态的函数，更新状态的函数会在下一帧渲染时执行
 */
function useRafState<S>(initialState?: S | (() => S)) {
  const ref = useRef(0); // 用于保存 requestAnimationFrame 的返回值，以便在组件卸载时取消动画帧的执行
  const [state, setState] = useState(initialState); // 使用 useState 来保存状态值

  // 定义一个用于在下一帧渲染时更新状态的函数
  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(ref.current); // 在设置新的状态值之前，取消之前的 requestAnimationFrame

    // 使用 requestAnimationFrame 来确保更新状态发生在下一帧渲染时
    ref.current = requestAnimationFrame(() => {
      setState(value); // 更新状态值
    });
  }, []);

  // 在组件卸载时，取消当前动画帧的执行
  useUnmount(() => {
    cancelAnimationFrame(ref.current);
  });

  return [state, setRafState] as const; // 返回状态值和更新状态的函数
}

export default useRafState;
