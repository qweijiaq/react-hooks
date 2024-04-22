import useRafState from '../useRafState';
import useEventListener from '../useEventListener';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';

export interface CursorState {
  // 光标在屏幕上的位置
  screenX: number;
  screenY: number;
  // 光标在窗口客户端区域内的位置
  clientX: number;
  clientY: number;
  // 光标在页面内的位置
  pageX: number;
  pageY: number;
  // 光标在指定元素内的相对位置信息
  elementX: number;
  elementY: number;
  // 指定元素的宽度和高度
  elementH: number;
  elementW: number;
  // 指定元素在页面中的绝对位置信息
  elementPosX: number;
  elementPosY: number;
}

// 初始光标状态
const initState: CursorState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
  elementX: NaN,
  elementY: NaN,
  elementH: NaN,
  elementW: NaN,
  elementPosX: NaN,
  elementPosY: NaN,
};

/**
 * 自定义 Hook，用于跟踪鼠标光标的状态，包括在指定元素上的位置信息。
 * @param target 目标元素的选择器，可选，默认为整个文档
 * @returns 返回光标状态对象，包括光标在屏幕、客户端、页面和指定元素内的位置信息
 */
export default (target?: BasicTarget) => {
  // 使用 useRafState Hook 创建光标状态和更新函数
  const [state, setState] = useRafState(initState);

  // 监听鼠标移动事件，更新光标状态
  useEventListener(
    'mousemove',
    (event: MouseEvent) => {
      // 提取事件中的光标位置信息
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
      // 构建新的光标状态对象
      const newState = {
        screenX,
        screenY,
        clientX,
        clientY,
        pageX,
        pageY,
        elementX: NaN,
        elementY: NaN,
        elementH: NaN,
        elementW: NaN,
        elementPosX: NaN,
        elementPosY: NaN,
      };
      // 获取指定目标元素
      const targetElement = getTargetElement(target);
      if (targetElement) {
        // @ts-ignore
        // 计算指定元素在页面中的位置信息
        const { left, top, width, height } = targetElement.getBoundingClientRect();
        newState.elementPosX = left + window.pageXOffset;
        newState.elementPosY = top + window.pageYOffset;
        newState.elementX = pageX - newState.elementPosX;
        newState.elementY = pageY - newState.elementPosY;
        newState.elementW = width;
        newState.elementH = height;
      }
      // 更新光标状态
      setState(newState);
    },
    {
      // 监听文档上的鼠标移动事件
      target: () => document,
    },
  );

  // 返回光标状态对象
  return state;
};
