import { useMemo } from 'react';
import useToggle from '../useToggle';

/**
 * 定义操作布尔值的接口，包含四种操作方法
 */
export interface Actions {
  setTrue: () => void; // 设置为 true 的方法
  setFalse: () => void; // 设置为 false 的方法
  set: (value: boolean) => void; // 设置布尔值的方法
  toggle: () => void; // 切换布尔值的方法
}

/**
 * useBoolean 自定义钩子函数，用于处理布尔值状态
 * @param defaultValue 默认布尔值，默认为 false
 * @returns 返回当前布尔值状态和操作对象
 */
export default function useBoolean(defaultValue = false): [boolean, Actions] {
  // 使用 useToggle 钩子获取布尔值状态和操作对象
  const [state, { toggle, set }] = useToggle(!!defaultValue);

  // 使用 useMemo 钩子创建操作对象
  const actions: Actions = useMemo(() => {
    // 定义四种操作方法
    const setTrue = () => set(true); // 设置为 true 的方法
    const setFalse = () => set(false); // 设置为 false 的方法
    return {
      toggle,
      set: (v) => set(!!v), // 设置布尔值的方法
      setTrue,
      setFalse,
    };
  }, []);

  return [state, actions]; // 返回当前布尔值状态和操作对象
}
