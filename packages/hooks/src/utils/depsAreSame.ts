import type { DependencyList } from 'react';

/**
 * 判断两个依赖数组是否相同。
 * @param oldDeps 旧的依赖数组
 * @param deps 新的依赖数组
 * @returns 如果两个依赖数组相同则返回 true，否则返回 false
 */
export default function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}
