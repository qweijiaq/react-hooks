import { useRef } from 'react';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b);

/**
 * 自定义 Hook，用于获取上一次渲染时的状态值。
 * @param state 当前的状态值
 * @param shouldUpdate 自定义函数，用于确定是否更新上一次状态值，默认为比较两个值是否相等
 * @returns 返回上一次渲染时的状态值
 */
const usePrevious = <T>(
  state: T, // 当前的状态值
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate, // 自定义函数，用于确定是否更新上一次状态值，默认为比较两个值是否相等
): T | undefined => {
  const prevRef = useRef<T>(); // 用于保存上一次状态值的引用
  const curRef = useRef<T>(); // 用于保存当前状态值的引用

  // 如果应该更新上一次状态值，则更新 prevRef 和 curRef 的值
  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current; // 将当前状态值保存为上一次状态值
    curRef.current = state; // 更新当前状态值
  }

  return prevRef.current; // 返回上一次渲染时的状态值
};

export default usePrevious;
