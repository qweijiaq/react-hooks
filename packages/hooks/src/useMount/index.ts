import { useEffect } from 'react';
import { isFunction } from '../utils';
import isDev from '../utils/isDev';

/**
 * 当组件挂载时执行给定的函数
 * @param fn 挂载时需要执行的函数
 */
const useMount = (fn: () => void) => {
  // 如果处于开发模式，并且传入的参数不是函数，则输出错误提示
  if (isDev) {
    if (!isFunction(fn)) {
      console.error(
        `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`,
      );
    }
  }

  // 使用 useEffect 监听组件挂载事件，并在挂载时执行传入的函数
  useEffect(() => {
    fn?.(); // 调用传入的函数，使用可选链操作符确保 fn 不为 undefined
  }, []);
};

export default useMount;
