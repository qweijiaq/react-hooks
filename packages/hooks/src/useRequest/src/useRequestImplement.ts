import useCreation from '../../useCreation';
import useLatest from '../../useLatest';
import useMemoizedFn from '../../useMemoizedFn';
import useMount from '../../useMount';
import useUnmount from '../../useUnmount';
import useUpdate from '../../useUpdate';
import isDev from '../../utils/isDev';

import Fetch from './Fetch';
import type { Options, Plugin, Result, Service } from './types';

/**
 * useRequestImplement 内部实现 Hook，用于处理请求的状态和行为，并与插件交互。
 * @param service 请求服务，一个异步函数，接受一组参数并返回一个 Promise。
 * @param options 选项，用于控制请求行为和处理结果。
 * @param plugins 插件数组，用于对请求进行拦截、处理和扩展。
 * @returns 返回一个结果对象，包含请求状态、数据、错误信息和相关操作。
 */
function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>, // 请求服务
  options: Options<TData, TParams> = {}, // 选项，默认为空对象
  plugins: Plugin<TData, TParams>[] = [], // 插件数组，默认为空数组
) {
  const { manual = false, ...rest } = options; // 解构选项，提取 manual 属性，默认为 false

  // 在开发环境下，检查是否传入了默认参数，并且默认参数是数组类型，如果不是则发出警告
  if (isDev) {
    if (options.defaultParams && !Array.isArray(options.defaultParams)) {
      console.warn(`expected defaultParams is array, got ${typeof options.defaultParams}`);
    }
  }

  // 构建请求选项对象，合并 manual 和其他选项
  const fetchOptions = {
    manual,
    ...rest,
  };

  const serviceRef = useLatest(service); // 缓存请求服务的引用
  const update = useUpdate(); // 获取更新函数

  // 创建 Fetch 实例
  const fetchInstance = useCreation(() => {
    // 初始化状态数组，通过执行插件的 onInit 方法获取初始状态，过滤掉空值
    const initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);

    // 创建 Fetch 实例，传入请求服务、请求选项、更新函数和初始状态
    return new Fetch<TData, TParams>(
      serviceRef,
      fetchOptions,
      update,
      Object.assign({}, ...initState), // 将初始状态对象合并为一个对象
    );
  }, []); // 依赖为空数组，只在组件初始化时执行一次
  fetchInstance.options = fetchOptions; // 将请求选项保存到 Fetch 实例中

  // 执行所有插件的钩子函数
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions));

  // 组件挂载时执行自动执行请求
  useMount(() => {
    if (!manual) {
      // 如果 manual 为 false，则执行请求
      const params = fetchInstance.state.params || options.defaultParams || []; // 获取参数列表
      // @ts-ignore
      fetchInstance.run(...params); // 执行请求
    }
  });

  // 组件卸载时取消请求
  useUnmount(() => {
    fetchInstance.cancel(); // 取消请求
  });

  // 返回请求结果对象，包含请求状态、数据、错误信息和相关操作
  return {
    loading: fetchInstance.state.loading, // 请求加载状态
    data: fetchInstance.state.data, // 请求数据
    error: fetchInstance.state.error, // 请求错误信息
    params: fetchInstance.state.params || [], // 请求参数列表
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)), // 取消请求函数
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)), // 刷新请求函数
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)), // 异步刷新请求函数
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)), // 执行请求函数
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)), // 异步执行请求函数
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)), // 修改请求数据函数
  } as Result<TData, TParams>; // 返回结果对象类型断言为 Result 类型
}

export default useRequestImplement; // 导出 useRequestImplement 函数
