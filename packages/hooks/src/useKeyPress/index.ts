import useLatest from '../useLatest';
import { isFunction, isNumber, isString } from '../utils';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import useDeepCompareEffectWithTarget from '../utils/useDeepCompareWithTarget';
import isAppleDevice from '../utils/isAppleDevice';

export type KeyType = number | string;
export type KeyPredicate = (event: KeyboardEvent) => KeyType | boolean | undefined;
export type KeyFilter = KeyType | KeyType[] | ((event: KeyboardEvent) => boolean);
export type KeyEvent = 'keydown' | 'keyup';

export type Target = BasicTarget<HTMLElement | Document | Window>;

export type Options = {
  events?: KeyEvent[];
  target?: Target;
  exactMatch?: boolean;
  useCapture?: boolean;
};

// 键盘事件 keyCode 别名
const aliasKeyCodeMap = {
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  backspace: 8,
  tab: 9,
  enter: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  pausebreak: 19,
  capslock: 20,
  esc: 27,
  space: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  leftarrow: 37,
  uparrow: 38,
  rightarrow: 39,
  downarrow: 40,
  insert: 45,
  delete: 46,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  leftwindowkey: 91,
  rightwindowkey: 92,
  meta: isAppleDevice ? [91, 93] : [91, 92],
  selectkey: 93,
  numpad0: 96,
  numpad1: 97,
  numpad2: 98,
  numpad3: 99,
  numpad4: 100,
  numpad5: 101,
  numpad6: 102,
  numpad7: 103,
  numpad8: 104,
  numpad9: 105,
  multiply: 106,
  add: 107,
  subtract: 109,
  decimalpoint: 110,
  divide: 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  numlock: 144,
  scrolllock: 145,
  semicolon: 186,
  equalsign: 187,
  comma: 188,
  dash: 189,
  period: 190,
  forwardslash: 191,
  graveaccent: 192,
  openbracket: 219,
  backslash: 220,
  closebracket: 221,
  singlequote: 222,
};

// 修饰键
const modifierKey = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => {
    if (event.type === 'keyup') {
      return aliasKeyCodeMap.meta.includes(event.keyCode);
    }
    return event.metaKey;
  },
};

// 判断合法的按键类型
function isValidKeyType(value: unknown): value is string | number {
  return isString(value) || isNumber(value);
}

// 根据 event 计算激活键数量
function countKeyByEvent(event: KeyboardEvent) {
  const countOfModifier = Object.keys(modifierKey).reduce((total, key) => {
    if (modifierKey[key](event)) {
      return total + 1;
    }

    return total;
  }, 0);

  // 16 17 18 91 92 是修饰键的 keyCode，如果 keyCode 是修饰键，那么激活数量就是修饰键的数量，如果不是，那么就需要 +1
  return [16, 17, 18, 91, 92].includes(event.keyCode) ? countOfModifier : countOfModifier + 1;
}

/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: any] 当前键
 * @returns string | number | boolean
 */
function genFilterKey(event: KeyboardEvent, keyFilter: KeyType, exactMatch: boolean) {
  // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
  if (!event.key) {
    return false;
  }

  // 数字类型直接匹配事件的 keyCode
  if (isNumber(keyFilter)) {
    return event.keyCode === keyFilter ? keyFilter : false;
  }

  // 字符串依次判断是否有组合键
  const genArr = keyFilter.split('.');
  let genLen = 0;

  for (const key of genArr) {
    // 组合键
    const genModifier = modifierKey[key];
    // keyCode 别名
    const aliasKeyCode: number | number[] = aliasKeyCodeMap[key.toLowerCase()];

    if ((genModifier && genModifier(event)) || (aliasKeyCode && aliasKeyCode === event.keyCode)) {
      genLen++;
    }
  }

  /**
   * 需要判断触发的键位和监听的键位完全一致，判断方法就是触发的键位里有且等于监听的键位
   * genLen === genArr.length 能判断出来触发的键位里有监听的键位
   * countKeyByEvent(event) === genArr.length 判断出来触发的键位数量里有且等于监听的键位数量
   * 主要用来防止按组合键其子集也会触发的情况，例如监听 ctrl+a 会触发监听 ctrl 和 a 两个键的事件。
   */
  if (exactMatch) {
    return genLen === genArr.length && countKeyByEvent(event) === genArr.length ? keyFilter : false;
  }
  return genLen === genArr.length ? keyFilter : false;
}

/**
 * 键盘输入预处理方法
 * @param [keyFilter: any] 当前键
 * @returns () => Boolean
 */
function genKeyFormatter(keyFilter: KeyFilter, exactMatch: boolean): KeyPredicate {
  if (isFunction(keyFilter)) {
    return keyFilter;
  }
  if (isValidKeyType(keyFilter)) {
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter, exactMatch);
  }
  if (Array.isArray(keyFilter)) {
    return (event: KeyboardEvent) =>
      keyFilter.find((item) => genFilterKey(event, item, exactMatch));
  }
  return () => Boolean(keyFilter);
}

const defaultEvents: KeyEvent[] = ['keydown'];

/**
 * 自定义 Hook，用于监听键盘按键事件，并根据指定的按键过滤条件和事件处理函数进行处理。
 * @param keyFilter 按键过滤条件，可以是单个按键字符串、按键数组或自定义过滤函数
 * @param eventHandler 键盘事件处理函数，接收键盘事件对象和触发的按键作为参数
 * @param option 可选项，包含 events、target、exactMatch 和 useCapture 四个属性
 */
function useKeyPress(
  keyFilter: KeyFilter, // 按键过滤条件
  eventHandler: (event: KeyboardEvent, key: KeyType) => void, // 键盘事件处理函数
  option?: Options, // 可选项
) {
  // 从 option 中提取 events、target、exactMatch 和 useCapture 属性，使用默认值或空对象进行处理
  const { events = defaultEvents, target, exactMatch = false, useCapture = false } = option || {};
  // 创建事件处理函数的引用和按键过滤条件的引用
  const eventHandlerRef = useLatest(eventHandler);
  const keyFilterRef = useLatest(keyFilter);

  // 使用深比较 useEffectWithTarget 来监听事件和目标元素的变化，并执行相应的事件处理逻辑
  useDeepCompareEffectWithTarget(
    () => {
      // 获取目标元素的引用或选择器字符串，并将其转换为引用形式
      const el = getTargetElement(target, window);
      // 如果目标元素不存在，则直接返回
      if (!el) {
        return;
      }

      // 定义回调处理函数，根据过滤条件处理键盘事件并调用事件处理函数
      const callbackHandler = (event: KeyboardEvent) => {
        // 生成按键过滤函数并进行匹配
        const genGuard = genKeyFormatter(keyFilterRef.current, exactMatch);
        const keyGuard = genGuard(event);
        // 如果匹配成功，则调用事件处理函数
        const firedKey = isValidKeyType(keyGuard) ? keyGuard : event.key;

        if (keyGuard) {
          return eventHandlerRef.current?.(event, firedKey);
        }
      };

      // 遍历事件数组，为目标元素添加键盘事件监听器
      for (const eventName of events) {
        el?.addEventListener?.(eventName, callbackHandler, useCapture);
      }
      // 返回清除监听器的函数，确保在组件卸载时执行
      return () => {
        for (const eventName of events) {
          el?.removeEventListener?.(eventName, callbackHandler, useCapture);
        }
      };
    },
    // 当事件数组发生变化时重新执行 useEffectWithTarget
    [events],
    target, // 监听目标元素的变化
  );
}

export default useKeyPress;
