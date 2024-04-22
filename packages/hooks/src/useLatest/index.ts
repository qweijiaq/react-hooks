import { useRef } from 'react';

/**
 * 返回传入值的最新引用
 * @param value 要跟踪的值
 * @returns 值的最新引用
 */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
