import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

/**
 * 使用 Set 集合的钩子，用于管理一组唯一的值。
 * @param {Iterable<K>} [initialValue] 初始值，可选，默认为空集合。
 * @returns {[Set<K>, { add: (key: K) => void; remove: (key: K) => void; reset: () => void; }]} 返回包含 Set 集合和操作函数的元组。
 */
function useSet<K>(initialValue?: Iterable<K>) {
  const getInitValue = () => new Set(initialValue); // 获取初始值的函数
  const [set, setSet] = useState<Set<K>>(getInitValue); // 使用状态钩子保存 Set 集合

  // 添加元素到集合中
  const add = (key: K) => {
    if (set.has(key)) {
      // 如果集合中已经存在该元素，则返回
      return;
    }
    setSet((prevSet) => {
      const temp = new Set(prevSet); // 创建临时集合，基于原集合的副本
      temp.add(key); // 向临时集合中添加元素
      return temp; // 返回新的集合
    });
  };

  // 从集合中移除指定元素
  const remove = (key: K) => {
    if (!set.has(key)) {
      // 如果集合中不存在该元素，则返回
      return;
    }
    setSet((prevSet) => {
      const temp = new Set(prevSet); // 创建临时集合，基于原集合的副本
      temp.delete(key); // 从临时集合中删除元素
      return temp; // 返回新的集合
    });
  };

  // 重置集合，将集合清空
  const reset = () => setSet(getInitValue());

  return [
    set, // 返回当前集合
    {
      add: useMemoizedFn(add), // 返回添加元素的函数
      remove: useMemoizedFn(remove), // 返回移除元素的函数
      reset: useMemoizedFn(reset), // 返回重置集合的函数
    },
  ] as const; // 返回元组
}

export default useSet; // 导出 useSet 钩子
