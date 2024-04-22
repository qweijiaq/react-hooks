import type { DependencyList } from 'react';
import type Fetch from './Fetch';
import type { CachedData } from './utils/cache';

/**
 * 定义服务类型，表示一个异步函数，接受一组参数并返回一个 Promise。
 */
export type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

/**
 * 定义订阅类型，表示一个无参数且无返回值的函数，用于订阅某些事件。
 */
export type Subscribe = () => void;

// for Fetch

/**
 * 表示 Fetch 状态的接口，包含加载状态、参数、数据和错误信息。
 */
export interface FetchState<TData, TParams extends any[]> {
  loading: boolean; // 加载状态
  params?: TParams; // 参数
  data?: TData; // 数据
  error?: Error; // 错误信息
}

/**
 * 插件返回类型，包含请求前、请求中、请求成功、请求失败、请求结束、取消和变更等事件的处理函数。
 */
export interface PluginReturn<TData, TParams extends any[]> {
  onBefore?: (params: TParams) => // 请求前
  | ({
        stopNow?: boolean; // 是否立即停止请求
        returnNow?: boolean; // 是否立即返回结果
      } & Partial<FetchState<TData, TParams>>)
    | void;

  onRequest?: (
    // 请求中
    service: Service<TData, TParams>, // 请求服务
    params: TParams, // 参数
  ) => {
    servicePromise?: Promise<TData>; // 用于覆盖默认的 Promise
  };

  onSuccess?: (data: TData, params: TParams) => void; // 请求成功
  onError?: (e: Error, params: TParams) => void; // 请求失败
  onFinally?: (params: TParams, data?: TData, e?: Error) => void; // 请求结束
  onCancel?: () => void; // 取消
  onMutate?: (data: TData) => void; // 变更
}

// for useRequestImplement

/**
 * 选项类型，包含各种配置项，用于控制请求行为和处理结果。
 */
export interface Options<TData, TParams extends any[]> {
  manual?: boolean; // 手动触发请求

  onBefore?: (params: TParams) => void; // 请求前回调
  onSuccess?: (data: TData, params: TParams) => void; // 请求成功回调
  onError?: (e: Error, params: TParams) => void; // 请求失败回调
  onFinally?: (params: TParams, data?: TData, e?: Error) => void; // 请求结束回调

  defaultParams?: TParams; // 默认参数

  refreshDeps?: DependencyList; // 刷新依赖
  refreshDepsAction?: () => void; // 刷新依赖动作

  loadingDelay?: number; // 加载延迟

  pollingInterval?: number; // 轮询间隔
  pollingWhenHidden?: boolean; // 隐藏时是否轮询
  pollingErrorRetryCount?: number; // 轮询错误重试次数

  refreshOnWindowFocus?: boolean; // 窗口获焦时是否刷新
  focusTimespan?: number; // 获焦时间间隔

  debounceWait?: number; // 防抖等待时间
  debounceLeading?: boolean; // 首次执行防抖函数
  debounceTrailing?: boolean; // 最后一次执行防抖函数
  debounceMaxWait?: number; // 最大等待时间

  throttleWait?: number; // 节流等待时间
  throttleLeading?: boolean; // 首次执行节流函数
  throttleTrailing?: boolean; // 最后一次执行节流函数

  cacheKey?: string; // 缓存键值
  cacheTime?: number; // 缓存时间
  staleTime?: number; // 过期时间
  setCache?: (data: CachedData<TData, TParams>) => void; // 设置缓存
  getCache?: (params: TParams) => CachedData<TData, TParams> | undefined; // 获取缓存

  retryCount?: number; // 重试次数
  retryInterval?: number; // 重试间隔

  ready?: boolean; // 准备就绪
}

/**
 * 插件类型，表示一个可以对请求进行拦截、处理和扩展的函数。
 */
export type Plugin<TData, TParams extends any[]> = {
  (fetchInstance: Fetch<TData, TParams>, options: Options<TData, TParams>): PluginReturn<
    TData,
    TParams
  >;
  onInit?: (options: Options<TData, TParams>) => Partial<FetchState<TData, TParams>>; // 初始化插件回调
};

/**
 * 结果类型，包含请求状态、数据、错误信息和相关操作。
 */
export interface Result<TData, TParams extends any[]> {
  loading: boolean; // 加载状态
  data?: TData; // 数据
  error?: Error; // 错误信息
  params: TParams | []; // 参数
  cancel: Fetch<TData, TParams>['cancel']; // 取消请求方法
  refresh: Fetch<TData, TParams>['refresh']; // 刷新请求方法
  refreshAsync: Fetch<TData, TParams>['refreshAsync']; // 异步刷新请求方法
  run: Fetch<TData, TParams>['run']; // 发起请求方法
  runAsync: Fetch<TData, TParams>['runAsync']; // 异步发起请求方法
  mutate: Fetch<TData, TParams>['mutate']; // 变更数据方法
}

/**
 * 超时类型，表示 setTimeout 函数的返回值。
 */
export type Timeout = ReturnType<typeof setTimeout>;
