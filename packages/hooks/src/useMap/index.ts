import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

/**
 * 自定义 Hook，用于管理 Map 数据结构。
 * @param initialValue 初始值，可选，默认为空的 Map
 * @returns 返回 Map 对象及其相关操作函数的元组
 */
function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  // 获取初始值的函数
  const getInitValue = () => new Map(initialValue);
  // 使用 useState Hook 创建 Map 对象的状态和更新函数
  const [map, setMap] = useState<Map<K, T>>(getInitValue);

  // 设置指定键值对的函数
  const set = (key: K, entry: T) => {
    // 更新 Map 状态
    setMap((prev) => {
      const temp = new Map(prev);
      temp.set(key, entry);
      return temp;
    });
  };

  // 设置整个 Map 的函数
  const setAll = (newMap: Iterable<readonly [K, T]>) => {
    // 更新 Map 状态
    setMap(new Map(newMap));
  };

  // 移除指定键的函数
  const remove = (key: K) => {
    // 更新 Map 状态
    setMap((prev) => {
      const temp = new Map(prev);
      temp.delete(key);
      return temp;
    });
  };

  // 重置 Map 为初始状态的函数
  const reset = () => setMap(getInitValue());

  // 获取指定键的值的函数
  const get = (key: K) => map.get(key);

  // 返回 Map 对象及其相关操作函数的元组
  return [
    map,
    {
      set: useMemoizedFn(set), // 使用 useMemoizedFn 优化 set 函数
      setAll: useMemoizedFn(setAll), // 使用 useMemoizedFn 优化 setAll 函数
      remove: useMemoizedFn(remove), // 使用 useMemoizedFn 优化 remove 函数
      reset: useMemoizedFn(reset), // 使用 useMemoizedFn 优化 reset 函数
      get: useMemoizedFn(get), // 使用 useMemoizedFn 优化 get 函数
    },
  ] as const;
}

export default useMap;
