import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useMemoizedFn from '../useMemoizedFn';

// 定义重置状态函数类型
type ResetState = () => void;

// 自定义 Hook：用于创建具有重置状态功能的状态管理器
const useResetState = <S>(
  initialState: S | (() => S), // 初始状态值或初始化函数
): [S, Dispatch<SetStateAction<S>>, ResetState] => {
  const [state, setState] = useState(initialState); // 使用 useState 创建状态及其更新函数

  // 创建重置状态函数，并使用 useMemoizedFn 进行性能优化
  const resetState = useMemoizedFn(() => {
    setState(initialState); // 重置状态为初始值
  });

  // 返回状态值、状态更新函数、重置状态函数的元组
  return [state, setState, resetState];
};

export default useResetState; // 导出自定义 Hook
