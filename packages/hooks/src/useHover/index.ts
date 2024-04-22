import useBoolean from '../useBoolean';
import useEventListener from '../useEventListener';
import type { BasicTarget } from '../utils/domTarget';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}

/**
 * 自定义 Hook，用于检测目标元素是否处于鼠标悬停状态，并提供相关事件的回调函数。
 * @param target 目标元素的引用或选择器字符串
 * @param options 可选项，包含进入悬停、离开悬停和状态变化的回调函数
 * @returns 返回一个布尔值，表示目标元素是否处于鼠标悬停状态
 */
export default (target: BasicTarget, options?: Options): boolean => {
  const { onEnter, onLeave, onChange } = options || {};

  // 使用 useBoolean Hook 创建一个状态值及其更新函数
  const [state, { setTrue, setFalse }] = useBoolean(false);

  // 监听鼠标进入事件，执行相关回调函数并更新状态值
  useEventListener(
    'mouseenter',
    () => {
      // 触发进入悬停的回调函数
      onEnter?.();
      // 设置状态为 true，表示目标元素处于鼠标悬停状态
      setTrue();
      // 触发状态变化的回调函数，并传入 true 作为参数
      onChange?.(true);
    },
    {
      target,
    },
  );

  // 监听鼠标离开事件，执行相关回调函数并更新状态值
  useEventListener(
    'mouseleave',
    () => {
      // 触发离开悬停的回调函数
      onLeave?.();
      // 设置状态为 false，表示目标元素不处于鼠标悬停状态
      setFalse();
      // 触发状态变化的回调函数，并传入 false 作为参数
      onChange?.(false);
    },
    {
      target,
    },
  );

  // 返回当前状态值，表示目标元素是否处于鼠标悬停状态
  return state;
};
