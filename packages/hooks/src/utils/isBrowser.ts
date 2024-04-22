/**
 * 判断当前环境是否为浏览器环境
 * @returns 如果当前环境为浏览器环境返回 true，否则返回 false
 */
const isBrowser = !!(
  (
    typeof window !== 'undefined' && // 判断 window 是否存在
    window.document && // 判断 document 是否存在
    window.document.createElement
  ) // 判断 createElement 方法是否存在
);

export default isBrowser;
