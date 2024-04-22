/**
 * 检查当前环境是否为开发环境
 * @returns 如果当前环境为开发环境返回true，否则返回false
 */
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export default isDev;
