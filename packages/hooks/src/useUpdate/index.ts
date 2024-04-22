import { useCallback, useState } from 'react';

/**
 * 创建一个用于强制组件重新渲染的函数。
 * 当调用该函数时，会强制触发组件重新渲染。
 * @returns {() => void} 一个函数，调用该函数会强制触发组件重新渲染。
 */
const useUpdate = () => {
  // 使用 useState 钩子创建一个状态，用于触发组件重新渲染
  const [, setState] = useState({});

  // 使用 useCallback 钩子返回一个 memoized 的更新函数
  return useCallback(() => setState({}), []);
};

export default useUpdate; // 导出 useUpdate 钩子
