// mock screen full events
// https://github.com/sindresorhus/screenfull/blob/main/index.js
/**
 * 这段代码是为了在测试环境中模拟全屏相关的方法和属性
 * 在 Jest 等测试框架中，通常无法直接操作 DOM，因此需要模拟一些浏览器环境的行为
 * 在这里，将全屏相关的方法和属性设置为空函数，可以避免在测试过程中因为调用这些方法而导致的错误，
 * 同时确保代码在测试环境中的运行正常
 */
const screenfullMethods = [
  'requestFullscreen', // 请求全屏
  'exitFullscreen', // 退出全屏
  'fullscreenElement', // 全屏元素
  'fullscreenEnabled', // 是否支持全屏
  'fullscreenchange', // 全屏状态变化事件
  'fullscreenerror', // 全屏错误事件
];
screenfullMethods.forEach((item) => {
  document[item] = () => {}; // 将 document 对象中的全屏方法替换为空函数
  HTMLElement.prototype[item] = () => {}; // 将 HTMLElement 原型链上的全屏方法替换为空函数
});
