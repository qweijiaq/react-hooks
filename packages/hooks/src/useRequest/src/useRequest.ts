import useAutoRunPlugin from './plugins/useAutoRunPlugin';
import useCachePlugin from './plugins/useCachePlugin';
import useDebouncePlugin from './plugins/useDebouncePlugin';
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin';
import usePollingPlugin from './plugins/usePollingPlugin';
import useRefreshOnWindowFocusPlugin from './plugins/useRefreshOnWindowFocusPlugin';
import useRetryPlugin from './plugins/useRetryPlugin';
import useThrottlePlugin from './plugins/useThrottlePlugin';
import type { Options, Plugin, Service } from './types';
import useRequestImplement from './useRequestImplement';

/**
 * useRequest 自定义 Hook，用于发起请求并处理请求状态和结果。
 * @param service 请求服务，一个异步函数，接受一组参数并返回一个 Promise。
 * @param options 选项，用于控制请求行为和处理结果。
 * @param plugins 插件数组，用于对请求进行拦截、处理和扩展。
 * @returns 返回一个结果对象，包含请求状态、数据、错误信息和相关操作。
 */
function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>, // 请求服务
  options?: Options<TData, TParams>, // 选项
  plugins?: Plugin<TData, TParams>[], // 插件数组
) {
  // 调用 useRequestImplement 自定义 Hook，传入请求服务、选项和默认插件列表
  return useRequestImplement<TData, TParams>(service, options, [
    ...(plugins || []), // 合并传入的插件数组
    useDebouncePlugin, // 防抖插件
    useLoadingDelayPlugin, // 加载延迟插件
    usePollingPlugin, // 轮询插件
    useRefreshOnWindowFocusPlugin, // 窗口获焦刷新插件
    useThrottlePlugin, // 节流插件
    useAutoRunPlugin, // 自动执行插件
    useCachePlugin, // 缓存插件
    useRetryPlugin, // 重试插件
  ] as Plugin<TData, TParams>[]); // 类型断言为插件数组
}

export default useRequest;
