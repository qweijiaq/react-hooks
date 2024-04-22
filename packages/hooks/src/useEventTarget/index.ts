import { useCallback, useState } from 'react';
import useLatest from '../useLatest';
import { isFunction } from '../utils';

interface EventTarget<U> {
  target: {
    value: U;
  };
}

export interface Options<T, U> {
  initialValue?: T;
  transformer?: (value: U) => T;
}

/**
 * 自定义 Hook，用于管理事件目标的状态及处理事件变化。
 * @param options 配置选项，包括初始值和值转换函数
 */
function useEventTarget<T, U = T>(options?: Options<T, U>) {
  // 从配置选项中解构初始值和值转换函数
  const { initialValue, transformer } = options || {};
  // 使用 useState Hook 来创建状态，初始值为配置中的初始值
  const [value, setValue] = useState(initialValue);

  // 使用 useLatest Hook 创建 transformerRef，用于保存转换函数的最新引用
  const transformerRef = useLatest(transformer);

  // 定义重置状态的回调函数，当调用时将状态重置为初始值
  const reset = useCallback(() => setValue(initialValue), []);

  // 定义处理事件变化的回调函数
  const onChange = useCallback((e: EventTarget<U>) => {
    // 获取事件目标的值
    const _value = e.target.value;
    // 如果存在值转换函数，则使用转换函数对值进行转换并更新状态
    if (isFunction(transformerRef.current)) {
      return setValue(transformerRef.current(_value));
    }
    // 如果没有值转换函数，则直接将值赋给状态
    // 注意：如果没有提供值转换函数，则假定 U 和 T 类型相同
    return setValue(_value as unknown as T);
  }, []);

  // 返回状态值及处理事件的回调函数
  return [
    value,
    {
      onChange,
      reset,
    },
  ] as const;
}

export default useEventTarget;
