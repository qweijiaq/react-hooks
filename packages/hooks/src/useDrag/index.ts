import { useRef } from 'react';
import useLatest from '../useLatest';
import useMount from '../useMount';
import { isString } from '../utils';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

export interface Options {
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  dragImage?: {
    image: string | Element;
    offsetX?: number;
    offsetY?: number;
  };
}

/**
 * 自定义 Hook，用于在指定元素上实现拖拽功能。
 * @param data 拖拽时传递的数据
 * @param target 拖拽目标元素或元素引用
 * @param options 拖拽选项，包括拖拽开始和结束的回调函数以及拖拽时显示的图像
 */
const useDrag = <T>(data: T, target: BasicTarget, options: Options = {}) => {
  // 使用 useRef Hook 来保存 options 和 data 的引用
  const optionsRef = useLatest(options);
  const dataRef = useLatest(data);
  // 用 useRef Hook 来保存拖拽时显示的图像元素的引用
  const imageElementRef = useRef<Element>();

  const { dragImage } = optionsRef.current;

  // 在组件挂载后执行的回调函数，用于初始化拖拽时显示的图像元素
  useMount(() => {
    if (dragImage?.image) {
      const { image } = dragImage;

      // 如果拖拽图像是字符串，创建一个新的图像元素
      if (isString(image)) {
        const imageElement = new Image();
        imageElement.src = image;
        imageElementRef.current = imageElement;
      } else {
        // 如果拖拽图像是元素，则直接使用该元素
        imageElementRef.current = image;
      }
    }
  });

  // 使用 useEffectWithTarget Hook，在目标元素上添加拖拽事件监听器
  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(target);
      if (!targetElement?.addEventListener) {
        return;
      }

      // 拖拽开始事件处理函数
      const onDragStart = (event: React.DragEvent) => {
        // 调用用户自定义的拖拽开始回调函数
        optionsRef.current.onDragStart?.(event);
        // 将拖拽数据转换为 JSON 字符串并设置到 dataTransfer 对象中
        event.dataTransfer.setData('custom', JSON.stringify(dataRef.current));

        // 如果存在拖拽图像且图像元素已创建，则设置拖拽图像
        if (dragImage?.image && imageElementRef.current) {
          const { offsetX = 0, offsetY = 0 } = dragImage;
          // 设置拖拽图像和偏移量
          event.dataTransfer.setDragImage(imageElementRef.current, offsetX, offsetY);
        }
      };

      // 拖拽结束事件处理函数
      const onDragEnd = (event: React.DragEvent) => {
        // 调用用户自定义的拖拽结束回调函数
        optionsRef.current.onDragEnd?.(event);
      };

      // 设置元素为可拖拽
      // @ts-ignore
      targetElement.setAttribute('draggable', 'true');

      // 添加拖拽开始和结束事件监听器
      targetElement.addEventListener('dragstart', onDragStart as any);
      targetElement.addEventListener('dragend', onDragEnd as any);

      // 在组件卸载时移除事件监听器
      return () => {
        targetElement.removeEventListener('dragstart', onDragStart as any);
        targetElement.removeEventListener('dragend', onDragEnd as any);
      };
    },
    // 依赖项为空数组，表示只在组件挂载和卸载时执行一次
    [],
    target,
  );
};

export default useDrag;
