import useLatest from '../useLatest';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import getDocumentOrShadow from '../utils/getDocumentOrShadow';
import useEffectWithTarget from '../utils/useEffectWithTarget';

type DocumentEventKey = keyof DocumentEventMap;

/**
 * 点击元素外部时执行回调函数的 hook
 * @param onClickAway 点击外部区域时执行的回调函数
 * @param target 监听点击事件的目标元素，可以是单个元素或元素数组
 * @param eventName 监听的事件名称或事件名称数组，默认为 'click'
 */
export default function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
  // 将 onClickAway 函数保存在 ref 中以便在 effect 中访问到最新的值
  const onClickAwayRef = useLatest(onClickAway);

  useEffectWithTarget(
    () => {
      // 点击事件处理函数，检查点击位置是否在目标元素外部，如果是则执行回调函数
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target];
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item);
            // @ts-ignore
            // 检查点击位置是否在目标元素外部
            return !targetElement || targetElement.contains(event.target);
          })
        ) {
          return;
        }
        onClickAwayRef.current(event);
      };

      // 获取要监听事件的文档或 Shadow DOM
      const documentOrShadow = getDocumentOrShadow(target);

      // 将事件名称转换为数组形式，便于统一处理
      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      // 添加事件监听器
      eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler));

      // 返回清除监听器的函数
      return () => {
        eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler));
      };
    },
    // 将事件名称和目标元素作为参数传递给 useEffectWithTarget
    Array.isArray(eventName) ? eventName : [eventName],
    target,
  );
}
