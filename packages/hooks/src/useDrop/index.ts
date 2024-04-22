import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';
import { useRef } from 'react';

export interface Options {
  onFiles?: (files: File[], event?: React.DragEvent) => void;
  onUri?: (url: string, event?: React.DragEvent) => void;
  onDom?: (content: any, event?: React.DragEvent) => void;
  onText?: (text: string, event?: React.ClipboardEvent) => void;
  onDragEnter?: (event?: React.DragEvent) => void;
  onDragOver?: (event?: React.DragEvent) => void;
  onDragLeave?: (event?: React.DragEvent) => void;
  onDrop?: (event?: React.DragEvent) => void;
  onPaste?: (event?: React.ClipboardEvent) => void;
}

/**
 * 自定义 Hook，用于在指定元素上实现拖拽放置功能。
 * @param target 拖拽放置目标元素或元素引用
 * @param options 拖拽放置选项，包括处理不同类型拖拽数据的回调函数
 */
const useDrop = (target: BasicTarget, options: Options = {}) => {
  const optionsRef = useLatest(options);

  // 用于保存拖拽进入的目标元素的引用
  const dragEnterTarget = useRef<any>();

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(target);
      if (!targetElement?.addEventListener) {
        return;
      }

      // 处理拖拽放置时的数据
      const onData = (
        dataTransfer: DataTransfer,
        event: React.DragEvent | React.ClipboardEvent,
      ) => {
        // 获取 URI 类型的数据
        const uri = dataTransfer.getData('text/uri-list');
        // 获取自定义类型的数据
        const dom = dataTransfer.getData('custom');

        // 如果存在自定义数据并且有处理自定义数据的回调函数，则调用回调函数处理数据
        if (dom && optionsRef.current.onDom) {
          let data = dom;
          try {
            // 尝试将自定义数据解析为 JSON 对象
            data = JSON.parse(dom);
          } catch (e) {
            data = dom;
          }
          optionsRef.current.onDom(data, event as React.DragEvent);
          return;
        }

        // 如果存在 URI 数据并且有处理 URI 数据的回调函数，则调用回调函数处理数据
        if (uri && optionsRef.current.onUri) {
          optionsRef.current.onUri(uri, event as React.DragEvent);
          return;
        }

        // 如果存在文件数据并且有处理文件数据的回调函数，则调用回调函数处理数据
        if (dataTransfer.files && dataTransfer.files.length && optionsRef.current.onFiles) {
          optionsRef.current.onFiles(Array.from(dataTransfer.files), event as React.DragEvent);
          return;
        }

        // 如果存在文本数据并且有处理文本数据的回调函数，则调用回调函数处理数据
        if (dataTransfer.items && dataTransfer.items.length && optionsRef.current.onText) {
          dataTransfer.items[0].getAsString((text) => {
            optionsRef.current.onText!(text, event as React.ClipboardEvent);
          });
        }
      };

      // 拖拽进入事件处理函数
      const onDragEnter = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // 记录拖拽进入的目标元素
        dragEnterTarget.current = event.target;
        // 调用拖拽进入回调函数
        optionsRef.current.onDragEnter?.(event);
      };

      // 拖拽过程中事件处理函数
      const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        // 调用拖拽过程中回调函数
        optionsRef.current.onDragOver?.(event);
      };

      // 拖拽离开事件处理函数
      const onDragLeave = (event: React.DragEvent) => {
        if (event.target === dragEnterTarget.current) {
          // 如果拖拽离开的目标元素与之前记录的目标元素相同，则调用拖拽离开回调函数
          optionsRef.current.onDragLeave?.(event);
        }
      };

      // 放置拖拽数据事件处理函数
      const onDrop = (event: React.DragEvent) => {
        event.preventDefault();
        // 处理拖拽数据
        onData(event.dataTransfer, event);
        // 调用放置拖拽数据回调函数
        optionsRef.current.onDrop?.(event);
      };

      // 粘贴事件处理函数
      const onPaste = (event: React.ClipboardEvent) => {
        // 处理粘贴的数据
        onData(event.clipboardData, event);
        // 调用粘贴事件回调函数
        optionsRef.current.onPaste?.(event);
      };

      // 添加事件监听器
      targetElement.addEventListener('dragenter', onDragEnter as any);
      targetElement.addEventListener('dragover', onDragOver as any);
      targetElement.addEventListener('dragleave', onDragLeave as any);
      targetElement.addEventListener('drop', onDrop as any);
      targetElement.addEventListener('paste', onPaste as any);

      // 在组件卸载时移除事件监听器
      return () => {
        targetElement.removeEventListener('dragenter', onDragEnter as any);
        targetElement.removeEventListener('dragover', onDragOver as any);
        targetElement.removeEventListener('dragleave', onDragLeave as any);
        targetElement.removeEventListener('drop', onDrop as any);
        targetElement.removeEventListener('paste', onPaste as any);
      };
    },
    // 依赖项为空数组，表示只在组件挂载和卸载时执行一次
    [],
    target,
  );
};

export default useDrop;
