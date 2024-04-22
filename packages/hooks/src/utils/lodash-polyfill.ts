import { debounce } from 'lodash-es';

/**
 * 检查当前环境是否为浏览器环境或 Node.js 环境。
 * @returns {boolean} 如果当前环境是浏览器环境或 Node.js 环境，则返回 true；否则返回 false。
 */
function isNodeOrWeb() {
  // 检查全局对象 global 是否存在，并且是一个对象，并且全局对象的 Object 属性引用的对象与全局对象相同
  const freeGlobal =
    (typeof global === 'undefined' ? 'undefined' : typeof global) == 'object' &&
    global &&
    global.Object === Object &&
    global;

  // 检查 self 对象是否存在，并且是一个对象，并且 self 对象的 Object 属性引用的对象与 self 对象相同
  const freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  // 如果存在浏览器全局对象或者 self 对象，则返回 true；否则返回 false
  return freeGlobal || freeSelf;
}

// 如果当前环境不是浏览器环境或 Node.js 环境，则将全局对象的 Date 属性设置为 Date 对象
if (!isNodeOrWeb()) {
  global.Date = Date;
}

// 导出 lodash-es 库中的 debounce 函数
export { debounce };
