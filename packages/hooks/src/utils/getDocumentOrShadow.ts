import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';

/**
 * 获取目标值的类型
 */
declare type TargetValue<T> = T | undefined | null;

/**
 * 检查是否所有目标元素都在 Shadow DOM 中
 * @param targets 目标元素数组
 * @returns 如果所有目标元素都在 Shadow DOM 中返回 true，否则返回 false
 */
const checkIfAllInShadow = (targets: BasicTarget[]): boolean => {
  return targets.every((item) => {
    const targetElement = getTargetElement(item);
    if (!targetElement) return false;
    // @ts-ignore
    if (targetElement.getRootNode() instanceof ShadowRoot) return true;
  });
};

/**
 * 获取目标元素的 Shadow DOM
 * @param node 目标元素
 * @returns 目标元素的 Shadow DOM，如果目标元素不存在，则返回 document
 */
const getShadow = (node: TargetValue<Element>) => {
  if (!node) {
    return document;
  }
  return node.getRootNode();
};

/**
 * 获取 Document 或 Shadow DOM
 * @param target 目标元素或目标元素数组
 * @returns Document 或 Shadow DOM
 */
const getDocumentOrShadow = (target: BasicTarget | BasicTarget[]): Document | Node => {
  if (!target || !document.getRootNode) {
    return document;
  }

  const targets = Array.isArray(target) ? target : [target];

  if (checkIfAllInShadow(targets)) {
    return getShadow(getTargetElement(targets[0]));
  }

  return document;
};

export default getDocumentOrShadow;
