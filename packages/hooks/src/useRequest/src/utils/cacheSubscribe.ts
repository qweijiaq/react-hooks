/**
 * 监听器类型，用于处理数据的回调函数。
 */
type Listener = (data: any) => void;

// 记录各个事件对应的监听器数组
const listeners: Record<string, Listener[]> = {};

/**
 * 触发指定事件的监听器，并传递数据给监听器。
 * @param key 事件的键名
 * @param data 要传递给监听器的数据
 */
const trigger = (key: string, data: any) => {
  // 检查事件是否有对应的监听器
  if (listeners[key]) {
    // 遍历执行事件的所有监听器，并传递数据
    listeners[key].forEach((item) => item(data));
  }
};

/**
 * 订阅指定事件，注册监听器，当事件触发时执行监听器。
 * @param key 事件的键名
 * @param listener 要注册的监听器函数
 * @returns 返回取消订阅的函数
 */
const subscribe = (key: string, listener: Listener) => {
  // 如果当前事件没有对应的监听器数组，则创建一个空数组
  if (!listeners[key]) {
    listeners[key] = [];
  }
  // 将监听器函数添加到对应事件的监听器数组中
  listeners[key].push(listener);

  // 返回一个取消订阅的函数，用于从事件的监听器数组中移除对应的监听器
  return function unsubscribe() {
    // 获取监听器在数组中的索引
    const index = listeners[key].indexOf(listener);
    // 从数组中移除监听器
    listeners[key].splice(index, 1);
  };
};

export { trigger, subscribe }; // 导出触发和订阅事件的方法
