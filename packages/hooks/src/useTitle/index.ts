import { useEffect, useRef } from 'react';
import useUnmount from '../useUnmount';
import isBrowser from '../utils/isBrowser';

export interface Options {
  restoreOnUnmount?: boolean;
}

const DEFAULT_OPTIONS: Options = {
  restoreOnUnmount: false,
};

/**
 * 用于设置页面标题，并在组件卸载时恢复原始标题。
 * @param {string} title 要设置的页面标题。
 * @param {Options} options 可选配置项，包括在组件卸载时是否恢复原始标题。
 */
function useTitle(title: string, options: Options = DEFAULT_OPTIONS) {
  // 创建一个保存原始标题的引用
  const titleRef = useRef(isBrowser ? document.title : '');

  // 当页面标题发生变化时更新页面标题
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 在组件卸载时恢复原始标题
  useUnmount(() => {
    if (options.restoreOnUnmount) {
      document.title = titleRef.current;
    }
  });
}

export default useTitle; // 导出 useTitle 钩子
