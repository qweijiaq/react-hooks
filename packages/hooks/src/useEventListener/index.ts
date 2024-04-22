import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type noop = (...p: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void;

function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void;

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void;

function useEventListener(eventName: string, handler: noop, options: Options): void;

/**
 * 自定义 Hook，用于在指定元素上绑定事件监听器。
 * @param eventName 事件名称，如 'click', 'scroll' 等
 * @param handler 事件处理函数，接收事件对象作为参数
 * @param options 事件监听器的配置选项，包括目标元素、是否捕获、是否执行一次、是否被动等
 */
function useEventListener(eventName: string, handler: noop, options: Options = {}) {
  // 使用 useLatest Hook 获取事件处理函数的最新版本
  const handlerRef = useLatest(handler);

  // 使用 useEffectWithTarget Hook，在目标元素上添加事件监听器
  useEffectWithTarget(
    () => {
      // 获取目标元素，默认为 window
      const targetElement = getTargetElement(options.target, window);
      // 如果目标元素不存在或不支持 addEventListener 方法，则直接返回
      if (!targetElement?.addEventListener) {
        return;
      }

      // 定义事件监听器函数
      const eventListener = (event: Event) => {
        return handlerRef.current(event);
      };

      // 添加事件监听器到目标元素上
      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      });

      // 返回清除事件监听器的函数
      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        });
      };
    },
    // useEffect 的依赖项包括事件名称、是否捕获、是否执行一次、是否被动以及目标元素
    [eventName, options.capture, options.once, options.passive],
    options.target,
  );
}

export default useEventListener;
