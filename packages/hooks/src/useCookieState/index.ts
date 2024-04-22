import Cookies from 'js-cookie';
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isFunction, isString } from '../utils';

/**
 * 表示一个状态，可以是字符串或 undefined。
 */
export type State = string | undefined;

/**
 * 选项接口，继承自 Cookies.CookieAttributes，用于配置 Cookie 的属性。
 */
export interface Options extends Cookies.CookieAttributes {
  /**
   * Cookie 的默认值，可以是状态值或返回状态值的函数。
   */
  defaultValue?: State | (() => State);
}

/**
 * 使用 Cookie 来存储状态的 Hook。
 * @param cookieKey Cookie 的键名
 * @param options Hook 的选项配置
 * @returns 返回一个包含状态值和更新状态的元组
 */
function useCookieState(cookieKey: string, options: Options = {}) {
  // 使用 useState 定义状态值，并根据 Cookie 中的值或默认值进行初始化
  const [state, setState] = useState<State>(() => {
    const cookieValue = Cookies.get(cookieKey);

    // 如果 Cookie 中存在值，则使用该值作为初始状态
    if (isString(cookieValue)) return cookieValue;

    // 如果提供了默认值函数，则调用该函数获取初始状态
    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    // 否则使用默认值作为初始状态
    return options.defaultValue;
  });

  // 使用 useMemoizedFn 包装更新状态的函数，确保函数引用不变
  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      // 解构获取新的 Cookie 选项和默认值
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };
      // 获取新的状态值
      const value = isFunction(newValue) ? newValue(state) : newValue;

      // 更新组件状态
      setState(value);

      // 如果状态值为 undefined，则移除对应的 Cookie
      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        // 否则设置对应的 Cookie
        Cookies.set(cookieKey, value, restOptions);
      }
    },
  );

  // 返回状态值和更新状态的元组
  return [state, updateState] as const;
}

export default useCookieState;
