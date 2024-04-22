import { useRef } from 'react';
import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import isBrowser from '../utils/isBrowser';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type EventType = MouseEvent | TouchEvent;
export interface Options {
  delay?: number;
  moveThreshold?: { x?: number; y?: number };
  onClick?: (event: EventType) => void;
  onLongPressEnd?: (event: EventType) => void;
}

const touchSupported =
  isBrowser &&
  // @ts-ignore
  ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch));

/**
 * 自定义 Hook，用于实现长按事件的处理。
 * @param onLongPress 长按事件的处理函数
 * @param target 目标元素的引用或选择器字符串
 * @param delay 长按延迟时间，默认为 300 毫秒
 * @param moveThreshold 移动阈值，用于设置长按触发前的移动阈值
 * @param onClick 点击事件的处理函数
 * @param onLongPressEnd 长按事件结束后的处理函数
 */
function useLongPress(
  onLongPress: (event: EventType) => void, // 长按事件的处理函数
  target: BasicTarget, // 目标元素的引用或选择器字符串
  { delay = 300, moveThreshold, onClick, onLongPressEnd }: Options = {}, // 可选项，包括延迟时间、移动阈值、点击事件和长按结束事件处理函数
) {
  // 创建长按事件处理函数的引用、点击事件处理函数的引用和长按结束事件处理函数的引用
  const onLongPressRef = useLatest(onLongPress);
  const onClickRef = useLatest(onClick);
  const onLongPressEndRef = useLatest(onLongPressEnd);

  // 创建定时器的引用、是否触发标志的引用和上一个位置的引用
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isTriggeredRef = useRef(false);
  const prevPositionRef = useRef({ x: 0, y: 0 });
  // 是否存在移动阈值
  const hasMoveThreshold = !!(
    (moveThreshold?.x && moveThreshold.x > 0) ||
    (moveThreshold?.y && moveThreshold.y > 0)
  );

  // 使用 useEffectWithTarget 监听事件和目标元素的变化，并执行相应的事件处理逻辑
  useEffectWithTarget(
    () => {
      // 获取目标元素的引用或选择器字符串，并将其转换为引用形式
      const targetElement = getTargetElement(target);
      // 如果目标元素不存在，则直接返回
      if (!targetElement?.addEventListener) {
        return;
      }

      // 判断是否超过移动阈值
      const overThreshold = (event: EventType) => {
        const { clientX, clientY } = getClientPosition(event);
        const offsetX = Math.abs(clientX - prevPositionRef.current.x);
        const offsetY = Math.abs(clientY - prevPositionRef.current.y);

        return !!(
          (moveThreshold?.x && offsetX > moveThreshold.x) ||
          (moveThreshold?.y && offsetY > moveThreshold.y)
        );
      };

      // 获取事件发生位置的客户端坐标
      function getClientPosition(event: EventType) {
        if (event instanceof TouchEvent) {
          return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
          };
        }

        if (event instanceof MouseEvent) {
          return {
            clientX: event.clientX,
            clientY: event.clientY,
          };
        }

        console.warn('Unsupported event type');

        return { clientX: 0, clientY: 0 };
      }

      // 长按事件开始时的处理函数
      const onStart = (event: EventType) => {
        // 如果存在移动阈值，则记录当前位置
        if (hasMoveThreshold) {
          const { clientX, clientY } = getClientPosition(event);
          prevPositionRef.current.x = clientX;
          prevPositionRef.current.y = clientY;
        }
        // 设置定时器，在延迟时间后触发长按事件
        timerRef.current = setTimeout(() => {
          onLongPressRef.current(event);
          isTriggeredRef.current = true;
        }, delay);
      };

      // 触摸移动事件的处理函数
      const onMove = (event: TouchEvent) => {
        // 如果定时器存在且超过移动阈值，则清除定时器
        if (timerRef.current && overThreshold(event)) {
          clearInterval(timerRef.current);
          timerRef.current = undefined;
        }
      };

      // 长按事件结束时的处理函数，根据条件触发点击事件或长按结束事件
      const onEnd = (event: EventType, shouldTriggerClick: boolean = false) => {
        // 清除定时器
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        // 如果触发了长按事件，则调用长按结束事件处理函数
        if (isTriggeredRef.current) {
          onLongPressEndRef.current?.(event);
        }
        // 如果应该触发点击事件且没有触发长按事件，则调用点击事件处理函数
        if (shouldTriggerClick && !isTriggeredRef.current && onClickRef.current) {
          onClickRef.current(event);
        }
        // 重置触发标志
        isTriggeredRef.current = false;
      };

      // 结束并触发点击事件的处理函数
      const onEndWithClick = (event: EventType) => onEnd(event, true);

      // 根据是否支持触摸事件添加事件监听器
      if (!touchSupported) {
        targetElement.addEventListener('mousedown', onStart);
        targetElement.addEventListener('mouseup', onEndWithClick);
        targetElement.addEventListener('mouseleave', onEnd);
        if (hasMoveThreshold) targetElement.addEventListener('mousemove', onMove);
      } else {
        targetElement.addEventListener('touchstart', onStart);
        targetElement.addEventListener('touchend', onEndWithClick);
        if (hasMoveThreshold) targetElement.addEventListener('touchmove', onMove);
      }
      // 返回清除监听器的函数，确保在组件卸载时执行
      return () => {
        // 清除定时器
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          // 重置触发标志
          isTriggeredRef.current = false;
        }
        // 根据是否支持触摸事件移除事件监听器
        if (!touchSupported) {
          targetElement.removeEventListener('mousedown', onStart);
          targetElement.removeEventListener('mouseup', onEndWithClick);
          targetElement.removeEventListener('mouseleave', onEnd);
          if (hasMoveThreshold) targetElement.removeEventListener('mousemove', onMove);
        } else {
          targetElement.removeEventListener('touchstart', onStart);
          targetElement.removeEventListener('touchend', onEndWithClick);
          if (hasMoveThreshold) targetElement.removeEventListener('touchmove', onMove);
        }
      };
    },
    // 事件监听器的依赖数组
    [],
    target, // 监听目标元素的变化
  );
}

export default useLongPress;
