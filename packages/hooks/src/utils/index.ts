/**
 * 判断值是否为对象
 * @param value 待判断的值
 * @returns 如果值为对象返回 true，否则返回 false
 */
export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object';

/**
 * 判断值是否为函数
 * @param value 待判断的值
 * @returns 如果值为函数返回 true，否则返回 false
 */
export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function';

/**
 * 判断值是否为字符串
 * @param value 待判断的值
 * @returns 如果值为字符串返回 true，否则返回 false
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * 判断值是否为布尔值
 * @param value 待判断的值
 * @returns 如果值为布尔值返回 true，否则返回 false
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * 判断值是否为数字
 * @param value 待判断的值
 * @returns 如果值为数字返回 true，否则返回 false
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number';

/**
 * 判断值是否为 undefined
 * @param value 待判断的值
 * @returns 如果值为 undefined 返回 true，否则返回 false
 */
export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined';
