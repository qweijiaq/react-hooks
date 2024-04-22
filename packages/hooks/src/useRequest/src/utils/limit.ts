/**
 * 限制函数的执行频率，在指定的时间段内只允许执行一次。
 * @param fn 要限制执行频率的函数
 * @param timespan 时间段，以毫秒为单位
 * @returns 返回一个新的函数，该函数在指定时间段内只允许执行一次。
 */
export default function limit(fn: any, timespan: number) {
  let pending = false;
  return (...args: any[]) => {
    if (pending) return;
    pending = true;
    fn(...args);
    setTimeout(() => {
      pending = false;
    }, timespan);
  };
}
