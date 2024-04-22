import isBrowser from './isBrowser';
import useEffectWithTarget from './useEffectWithTarget';
import useLayoutEffectWithTarget from './useLayoutEffectWithTarget';

/**
 * 根据环境选择性地使用 useLayoutEffectWithTarget 或 useEffectWithTarget
 * 当在浏览器环境下时，使用 useLayoutEffectWithTarget
 * 在服务器端或非浏览器环境下时，使用 useEffectWithTarget
 * @param effect 副作用函数
 * @param deps 依赖项数组
 * @param target 目标对象或目标对象数组
 */
const useIsomorphicLayoutEffectWithTarget = isBrowser
  ? useLayoutEffectWithTarget // 在浏览器环境下使用 useLayoutEffectWithTarget
  : useEffectWithTarget; // 在服务器端或非浏览器环境下使用 useEffectWithTarget

export default useIsomorphicLayoutEffectWithTarget;
