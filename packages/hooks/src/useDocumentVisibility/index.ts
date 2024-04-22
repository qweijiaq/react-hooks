import { useState } from 'react';
import useEventListener from '../useEventListener';
import isBrowser from '../utils/isBrowser';

type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined;

const getVisibility = () => {
  if (!isBrowser) {
    return 'visible';
  }
  return document.visibilityState;
};

/**
 * 自定义 Hook，用于获取文档的可见性状态
 * @returns 返回当前文档的可见性状态，可能的取值为 'hidden'、'visible'、'prerender' 或 undefined。
 */
function useDocumentVisibility(): VisibilityState {
  // 使用 useState Hook 来保存当前文档的可见性状态
  const [documentVisibility, setDocumentVisibility] = useState(() => getVisibility());

  // 使用 useEventListener Hook，在文档的可见性状态变化时更新状态值
  useEventListener(
    'visibilitychange',
    () => {
      setDocumentVisibility(getVisibility());
    },
    {
      // 设置事件监听器的目标为 document
      target: () => document,
    },
  );

  return documentVisibility;
}

export default useDocumentVisibility;
