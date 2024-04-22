import type { DependencyList, EffectCallback } from 'react';
import { useRef } from 'react';
import type { BasicTarget } from './domTarget';
import useEffectWithTarget from './useEffectWithTarget';
import { depsEqual } from './depsEqual';

/**
 * 自定义 hook，实现带目标对象的深比较副作用
 * @param effect 副作用函数
 * @param deps 依赖项数组
 * @param target 目标对象或目标对象数组
 */
const useDeepCompareEffectWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[],
) => {
  const ref = useRef<DependencyList>(); // 用于存储上一次的依赖项
  const signalRef = useRef<number>(0); // 用于触发副作用的信号

  // 检查依赖项是否发生变化，如果发生变化则更新 ref 和 signalRef
  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  // 使用带目标对象的 useEffect 运行副作用
  useEffectWithTarget(effect, [signalRef.current], target);
};

export default useDeepCompareEffectWithTarget;
