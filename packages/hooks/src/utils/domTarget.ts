import type { MutableRefObject } from 'react';
import { isFunction } from './index';
import isBrowser from './isBrowser';

/**
 * 目标值类型
 */
type TargetValue<T> = T | undefined | null;

/**
 * 目标类型
 */
type TargetType = HTMLElement | Element | Window | Document;

/**
 * 基本目标类型
 */
export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | MutableRefObject<TargetValue<T>>;

/**
 * 获取目标元素
 * @param target 目标元素或返回目标元素的函数或可变引用对象
 * @param defaultElement 默认的目标元素，当目标元素为空时使用
 * @returns 目标元素
 */
export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  // 如果不是浏览器环境，则返回 undefined
  if (!isBrowser) {
    return undefined;
  }

  // 如果目标元素为空，则返回默认元素
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetValue<T>;

  // 如果目标是一个函数，则调用函数获取目标元素
  if (isFunction(target)) {
    targetElement = target();
  }
  // 如果目标是一个可变引用对象，则获取其 current 属性作为目标元素
  else if ('current' in target) {
    targetElement = target.current;
  }
  // 否则，目标本身就是元素，直接返回
  else {
    targetElement = target;
  }

  return targetElement;
}
