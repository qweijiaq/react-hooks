import isBrowser from '../../../utils/isBrowser';

/**
 * 检查 Document 是否可见。
 * @returns 如果 Document 可见返回 true，否则返回 false。
 */
export default function isDocumentVisible(): boolean {
  if (isBrowser) {
    return document.visibilityState !== 'hidden';
  }
  return true;
}
