import isBrowser from '../../../utils/isBrowser';

/**
 * 检查浏览器是否在线。
 * @returns 如果浏览器在线返回 true，否则返回 false。
 */
export default function isOnline(): boolean {
  if (isBrowser && typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}
