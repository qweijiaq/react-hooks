import { useEffect, useState } from 'react';
import useDebounceFn from '../useDebounceFn';
import type { DebounceOptions } from './debounceOptions';

/**
 * 使用防抖功能的自定义 Hook
 * @param value 需要进行防抖处理的值
 * @param options 防抖函数的配置选项
 * @returns 经过防抖处理的值
 */
function useDebounce<T>(value: T, options?: DebounceOptions) {
  // 使用 useState Hook 来保存经过防抖处理的值
  const [debounced, setDebounced] = useState(value);

  // 使用 useDebounceFn Hook 创建一个防抖函数，每当值变化时调用该函数以更新经过防抖处理的值
  const { run } = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  // 使用 useEffect Hook 在值变化时运行防抖函数
  useEffect(() => {
    run();
  }, [value]);

  // 返回经过防抖处理的值
  return debounced;
}

export default useDebounce;
