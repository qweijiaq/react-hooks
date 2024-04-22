import isBrowser from '../../../utils/isBrowser';
import isDocumentVisible from './isDocumentVisible';

type Listener = () => void;

// 存储所有订阅者的数组
const listeners: Listener[] = [];

/**
 * 订阅函数，用于向订阅者数组中添加新的监听器。
 * @param listener 要添加的监听器函数
 * @returns 取消订阅的函数，用于移除已添加的监听器
 */
function subscribe(listener: Listener) {
  listeners.push(listener);
  return function unsubscribe() {
    // 查找要移除的监听器在数组中的索引
    const index = listeners.indexOf(listener);
    // 如果找到了监听器，则从数组中移除
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

// 如果运行环境是浏览器
if (isBrowser) {
  // 定义重新验证函数，用于检查文档是否可见，然后调用所有监听器函数
  const revalidate = () => {
    // 如果文档不可见，则不执行后续操作
    if (!isDocumentVisible()) return;
    // 遍历所有订阅的监听器，依次调用
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  // 监听文档可见性变化事件，触发重新验证函数
  window.addEventListener('visibilitychange', revalidate, false);
}

export default subscribe;
