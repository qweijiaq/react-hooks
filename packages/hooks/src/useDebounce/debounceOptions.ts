/**
 * 防抖函数的配置选项
 * @property wait 等待时间，单位毫秒，默认值为1000，表示事件触发1s后执行
 * @property leading 是否在延迟开始前调用函数，默认为false，表示延迟结束后调用函数
 * @property trailing 是否在延迟结束后调用函数，默认为true，表示延迟结束后调用函数
 * @property maxWait 设置最大等待时间，单位毫秒，默认为 undefined，表示没有最大等待时间
 */
export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}
