import { useMemo, useState } from 'react';

/**
 * 定义操作对象的接口，包含四种操作方法
 */
export interface Actions<T> {
  setLeft: () => void; // 设置为左值的方法
  setRight: () => void; // 设置为右值的方法
  set: (value: T) => void; // 设置值的方法
  toggle: () => void; // 切换值的方法
}

/**
 * useToggle 自定义钩子函数，用于切换布尔值或其他类型的值
 * @returns 返回当前状态值和操作对象
 */
function useToggle<T = boolean>(): [boolean, Actions<T>]; // 函数重载签名1

/**
 * useToggle 自定义钩子函数，用于切换布尔值或其他类型的值
 * @param defaultValue 默认值
 * @returns 返回当前状态值和操作对象
 */
function useToggle<T>(defaultValue: T): [T, Actions<T>]; // 函数重载签名2

/**
 * useToggle 自定义钩子函数，用于切换布尔值或其他类型的值
 * @param defaultValue 默认值
 * @param reverseValue 反转值
 * @returns 返回当前状态值和操作对象
 */
function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>]; // 函数重载签名3

/**
 * useToggle 自定义钩子函数，用于切换布尔值或其他类型的值
 * @param defaultValue 默认值
 * @param reverseValue 反转值
 */
function useToggle<D, R>(defaultValue: D = false as unknown as D, reverseValue?: R) {
  // 使用 useState 钩子获取状态值和状态更新函数
  const [state, setState] = useState<D | R>(defaultValue);

  // 使用 useMemo 钩子创建操作对象
  const actions = useMemo(() => {
    // 计算反转值的原始值
    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    // 定义四种操作方法
    const toggle = () => setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue)); // 切换值的方法
    const set = (value: D | R) => setState(value); // 设置值的方法
    const setLeft = () => setState(defaultValue); // 设置为左值的方法
    const setRight = () => setState(reverseValueOrigin); // 设置为右值的方法

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
  }, []); // 依赖为空数组，表示该对象仅在组件挂载时创建一次

  return [state, actions]; // 返回当前状态值和操作对象
}

export default useToggle; // 导出 useToggle 钩子函数
