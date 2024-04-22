import useRafState from '../useRafState';
import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type Position = { left: number; top: number };

export type Target = BasicTarget<Element | Document>;
export type ScrollListenController = (val: Position) => boolean;

/**
 * 使用滚动监听钩子，监听指定目标的滚动位置变化。
 * @param {Target} [target] 目标元素，默认为 document。
 * @param {ScrollListenController} [shouldUpdate] 是否应更新位置的控制器，默认为始终更新。
 * @returns {Position | undefined} 返回当前滚动位置，如果目标不存在或未定义，则返回 undefined。
 */
function useScroll(
  target?: Target,
  shouldUpdate: ScrollListenController = () => true,
): Position | undefined {
  const [position, setPosition] = useRafState<Position>(); // 使用带有 raf 的状态钩子

  const shouldUpdateRef = useLatest(shouldUpdate); // 使用最新的控制器引用

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target, document); // 获取目标元素
      if (!el) {
        return; // 如果目标元素不存在，则返回
      }
      const updatePosition = () => {
        let newPosition: Position;
        if (el === document) {
          // 如果目标为 document
          if (document.scrollingElement) {
            // 如果有滚动元素
            newPosition = {
              left: document.scrollingElement.scrollLeft,
              top: document.scrollingElement.scrollTop,
            };
          } else {
            // 在怪异模式下，scrollingElement 属性返回 HTML body 元素（如果存在且可能可滚动），否则返回 null。
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/scrollingElement
            // https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
            newPosition = {
              left: Math.max(
                window.pageXOffset,
                document.documentElement.scrollLeft,
                document.body.scrollLeft,
              ),
              top: Math.max(
                window.pageYOffset,
                document.documentElement.scrollTop,
                document.body.scrollTop,
              ),
            };
          }
        } else {
          // 如果目标为普通元素
          newPosition = {
            // @ts-ignore
            left: (el as Element).scrollLeft,
            // @ts-ignore
            top: (el as Element).scrollTop,
          };
        }
        if (shouldUpdateRef.current(newPosition)) {
          // 如果应更新位置
          setPosition(newPosition); // 设置位置
        }
      };

      updatePosition(); // 更新初始位置

      el.addEventListener('scroll', updatePosition); // 添加滚动监听事件
      return () => {
        el.removeEventListener('scroll', updatePosition); // 移除滚动监听事件
      };
    },
    [],
    target,
  );

  return position; // 返回当前滚动位置
}

export default useScroll; // 导出滚动监听钩子
