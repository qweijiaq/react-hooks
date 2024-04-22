/* eslint-disable @typescript-eslint/no-parameter-properties */
import { isFunction } from '../../utils';
import type { MutableRefObject } from 'react';
import type { FetchState, Options, PluginReturn, Service, Subscribe } from './types';

/**
 * Fetch 类用于管理请求的状态和行为，包括发送请求、处理请求结果以及与插件的交互。
 * @template TData 请求返回的数据类型
 * @template TParams 请求的参数类型
 */
export default class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[]; // 插件实现数组

  count: number = 0; // 请求计数，默认为0

  state: FetchState<TData, TParams> = {
    // 请求状态对象，默认包含 loading、params、data 和 error 属性
    loading: false, // 请求加载状态，默认为 false
    params: undefined, // 请求参数，默认为 undefined
    data: undefined, // 请求返回的数据，默认为 undefined
    error: undefined, // 请求错误信息，默认为 undefined
  };

  /**
   * 构造函数，初始化 Fetch 实例。
   * @param serviceRef 请求服务的引用
   * @param options 请求选项，控制请求行为和结果处理
   * @param subscribe 订阅函数，用于更新状态
   * @param initState 初始状态对象，用于在构造函数中初始化状态
   */
  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>, // 请求服务的引用
    public options: Options<TData, TParams>, // 请求选项
    public subscribe: Subscribe, // 订阅函数，用于更新状态
    public initState: Partial<FetchState<TData, TParams>> = {}, // 初始状态对象，默认为空对象
  ) {
    this.state = {
      // 初始化状态对象
      ...this.state,
      loading: !options.manual, // 如果 manual 为 false，则初始化时设置 loading 为 true
      ...initState, // 合并 initState
    };
  }

  /**
   * 设置状态的方法。
   * @param s 需要设置的状态对象
   */
  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      // 更新状态
      ...this.state,
      ...s,
    };
    this.subscribe(); // 触发订阅，通知状态更新
  }

  /**
   * 执行插件处理函数的方法。
   * @param event 插件处理事件名称
   * @param rest 其他参数
   */
  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean); // 执行插件处理函数，过滤空值
    return Object.assign({}, ...r); // 合并处理结果为一个对象
  }

  /**
   * 异步执行请求的方法。
   * @param params 请求参数
   * @returns 返回一个 Promise，包含请求返回的数据
   */
  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1; // 每次执行请求计数加1
    const currentCount = this.count; // 缓存当前计数值

    const {
      stopNow = false, // 是否立即停止请求的标志，默认为 false
      returnNow = false, // 是否立即返回结果的标志，默认为 false
      ...state
    } = this.runPluginHandler('onBefore', params); // 执行 onBefore 插件处理函数，获取处理结果

    // 如果 stopNow 为 true，则返回一个空 Promise，立即停止请求
    if (stopNow) {
      return new Promise(() => {});
    }

    // 更新状态，设置 loading 为 true，并将请求参数和其他状态信息合并到状态对象中
    this.setState({
      loading: true,
      params,
      ...state,
    });

    // 如果 returnNow 为 true，则立即返回结果
    if (returnNow) {
      return Promise.resolve(state.data);
    }

    // 执行请求前的钩子函数
    this.options.onBefore?.(params);

    try {
      // 替换请求服务，执行 onRequest 插件处理函数，获取服务的 Promise
      let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);

      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      const res = await servicePromise; // 等待服务的 Promise 返回结果

      // 如果当前计数值不等于实例计数值，则阻止后续处理并返回一个空 Promise
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      // 更新状态，设置返回的数据和错误信息，并将 loading 设置为 false
      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      // 执行请求成功的钩子函数
      this.options.onSuccess?.(res, params);
      this.runPluginHandler('onSuccess', res, params);

      // 执行请求结束的钩子函数
      this.options.onFinally?.(params, res, undefined);

      // 如果当前计数值等于实例计数值，则执行请求结束的钩子函数
      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, res, undefined);
      }

      return res; // 返回请求返回的数据
    } catch (error) {
      // 如果当前计数值不等于实例计数值，则阻止后续处理并返回一个空 Promise
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      // 更新状态，设置错误信息，并将 loading 设置为 false
      this.setState({
        error,
        loading: false,
      });

      // 执行请求失败的钩子函数
      this.options.onError?.(error, params);
      this.runPluginHandler('onError', error, params);

      // 执行请求结束的钩子函数
      this.options.onFinally?.(params, undefined, error);

      // 如果当前计数值等于实例计数值，则执行请求结束的钩子函数
      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error);
      }

      throw error; // 抛出错误
    }
  }

  /**
   * 执行请求的方法。
   * @param params 请求参数
   */
  run(...params: TParams) {
    // 执行异步请求方法，并捕获错误，如果没有指定 onError 函数，则在控制台输出错误信息
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  /**
   * 取消请求的方法。
   */
  cancel() {
    this.count += 1; // 每次取消请求计数加1
    // 更新状态，设置 loading 为 false
    this.setState({
      loading: false,
    });

    // 执行取消请求的钩子函数
    this.runPluginHandler('onCancel');
  }

  /**
   * 刷新请求的方法。
   */
  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || [])); // 执行请求，使用当前参数列表
  }

  /**
   * 异步刷新请求的方法。
   * @returns 返回一个 Promise，包含请求返回的数据
   */
  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || [])); // 执行异步请求，使用当前参数列表
  }

  /**
   * 修改请求返回的数据的方法。
   * @param data 请求返回的数据或一个函数，用于修改原始数据
   */
  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data; // 如果传入的是函数，则执行函数获取目标数据
    this.runPluginHandler('onMutate', targetData); // 执行数据变更前的钩子函数
    // 更新状态，设置新的数据
    this.setState({
      data: targetData,
    });
  }
}
