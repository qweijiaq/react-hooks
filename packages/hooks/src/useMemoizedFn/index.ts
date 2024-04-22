import { useMemo, useRef } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

type noop = (this: any, ...args: any[]) => any;

/**
 * 将函数转换为记忆化函数的类型
 */
type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

/**
 * 创建一个记忆化函数，该函数会记住传入的函数，并在传入的函数发生变化时更新
 * @param fn 需要记忆化的函数
 * @returns 记忆化后的函数
 */
function useMemoizedFn<T extends noop>(fn: T) {
  // 如果处于开发模式，并且传入的参数不是函数，则输出错误提示
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
    }
  }

  // 使用 useRef 创建一个保存传入函数的引用
  const fnRef = useRef<T>(fn);

  // 使用 useMemo 更新 fnRef.current，以便在传入的函数发生变化时更新
  fnRef.current = useMemo(() => fn, [fn]);

  // 使用 useRef 创建一个保存记忆化函数的引用
  const memoizedFn = useRef<PickFunction<T>>();

  // 如果 memoizedFn.current 不存在，则创建一个记忆化函数并保存在 memoizedFn 中
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      // 调用原始函数，并返回其结果
      return fnRef.current.apply(this, args);
    };
  }

  // 返回记忆化函数
  return memoizedFn.current as T;
}

export default useMemoizedFn;
