import type { DependencyList } from 'react';
import { useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';

/**
 * 自定义 Hook，用于在组件中创建一个对象，并在依赖项变化时重新创建对象。
 * @param factory 一个工厂函数，用于创建对象
 * @param deps 依赖项数组，当数组中的任何依赖项发生变化时，将重新创建对象
 * @returns 返回创建的对象
 */
export default function useCreation<T>(factory: () => T, deps: DependencyList) {
  // 使用 useRef 创建一个对象，用于保存依赖项和创建的对象
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T, // 保存创建的对象
    initialized: false, // 标记对象是否已经初始化
  });

  // 如果对象尚未初始化或者依赖项发生变化，则重新创建对象
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    // 更新依赖项和标记对象已经初始化
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }

  // 返回创建的对象
  return current.obj as T;
}
