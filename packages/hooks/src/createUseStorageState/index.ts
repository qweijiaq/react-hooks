import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn'; // 导入 useMemoizedFn 钩子
import useUpdateEffect from '../useUpdateEffect'; // 导入 useUpdateEffect 钩子
import { isFunction, isUndef } from '../utils'; // 导入工具函数

// 定义 SetState 类型，表示状态更新函数的参数类型
export type SetState<S> = S | ((prevState?: S) => S);

// 定义选项接口，用于配置 useStorageState 钩子
export interface Options<T> {
  defaultValue?: T | (() => T); // 默认值或默认值生成函数
  serializer?: (value: T) => string; // 序列化器函数
  deserializer?: (value: string) => T; // 反序列化器函数
  onError?: (error: unknown) => void; // 错误处理函数
}

// 创建 useStorageState 钩子函数
export function createUseStorageState(getStorage: () => Storage | undefined) {
  function useStorageState<T>(key: string, options: Options<T> = {}) {
    let storage: Storage | undefined;
    const {
      onError = (e) => {
        // 默认错误处理函数
        console.error(e);
      },
    } = options;

    // 尝试获取存储对象，捕获可能的异常并执行错误处理函数
    try {
      storage = getStorage();
    } catch (err) {
      onError(err);
    }

    // 定义序列化器函数
    const serializer = (value: T) => {
      if (options.serializer) {
        // 如果提供了自定义序列化器函数，则使用自定义函数
        return options.serializer(value);
      }
      return JSON.stringify(value); // 否则使用 JSON 序列化
    };

    // 定义反序列化器函数
    const deserializer = (value: string): T => {
      if (options.deserializer) {
        // 如果提供了自定义反序列化器函数，则使用自定义函数
        return options.deserializer(value);
      }
      return JSON.parse(value); // 否则使用 JSON 反序列化
    };

    // 获取存储的值
    function getStoredValue() {
      try {
        const raw = storage?.getItem(key); // 获取存储中的原始值
        if (raw) {
          // 如果原始值存在，则反序列化为对应类型的值
          return deserializer(raw);
        }
      } catch (e) {
        onError(e); // 捕获可能的异常并执行错误处理函数
      }
      if (isFunction(options.defaultValue)) {
        // 如果默认值是函数，则调用该函数获取默认值
        return options.defaultValue();
      }
      return options.defaultValue; // 否则返回默认值
    }

    // 定义状态和状态更新函数
    const [state, setState] = useState(getStoredValue);

    // 使用 useUpdateEffect 钩子，在 key 发生变化时更新状态
    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);

    // 定义更新状态的函数
    const updateState = (value?: SetState<T>) => {
      const currentState = isFunction(value) ? value(state) : value; // 计算新的状态值
      setState(currentState); // 更新状态

      if (isUndef(currentState)) {
        // 如果新状态值为 undefined，则移除存储中的对应项
        storage?.removeItem(key);
      } else {
        // 否则将新状态值序列化后存储到对应项中
        try {
          storage?.setItem(key, serializer(currentState));
        } catch (e) {
          console.error(e); // 捕获可能的异常并输出到控制台
        }
      }
    };

    // 返回状态值和更新状态的函数
    return [state, useMemoizedFn(updateState)] as const;
  }
  return useStorageState;
}
