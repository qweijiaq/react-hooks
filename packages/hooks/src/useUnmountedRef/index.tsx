import { useEffect, useRef } from 'react';

/**
 * 创建一个用于跟踪组件是否已卸载的引用。
 * 当组件已卸载时，引用的值为 true；否则为 false。
 * @returns {React.MutableRefObject<boolean>} 一个 MutableRefObject，用于保存组件是否已卸载的状态。
 */
const useUnmountedRef = () => {
  // 创建一个 useRef 钩子，用于保存组件是否已卸载的状态，默认为 false
  const unmountedRef = useRef(false);

  // 在组件挂载时和更新时将 unmountedRef.current 设为 false
  useEffect(() => {
    unmountedRef.current = false;
    // 当组件卸载时，将 unmountedRef.current 设为 true
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  // 返回保存组件是否已卸载的状态的引用
  return unmountedRef;
};

export default useUnmountedRef; // 导出 useUnmountedRef 钩子
