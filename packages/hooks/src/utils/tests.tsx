import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';

// 导出所有来自 '@testing-library/react' 的内容
export * from '@testing-library/react';

// 根据环境变量 REACT_MODE 决定是否使用 StrictMode 包装组件
const Wrapper = process.env.REACT_MODE === 'strict' ? StrictMode : undefined;

// 定义一个与 renderHook 具有相同类型的函数 customRender
const customRender: typeof renderHook = (ui, options) =>
  renderHook(ui, { wrapper: Wrapper, ...options });

// 导出 customRender 作为 renderHook 的别名
export { customRender as renderHook };
