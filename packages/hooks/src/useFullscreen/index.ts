import { useEffect, useState, useRef } from 'react';
import screenfull from 'screenfull';
import useLatest from '../useLatest';
import useMemoizedFn from '../useMemoizedFn';
import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import { isBoolean } from '../utils';

export interface PageFullscreenOptions {
  className?: string;
  zIndex?: number;
}

export interface Options {
  onExit?: () => void;
  onEnter?: () => void;
  pageFullscreen?: boolean | PageFullscreenOptions;
}

/**
 * 自定义 Hook，用于管理全屏状态及处理全屏事件
 * @param target 目标元素，全屏操作将针对该元素进行
 * @param options 配置选项，包括进入/退出全屏时的回调函数和页面全屏选项
 */
const useFullscreen = (target: BasicTarget, options?: Options) => {
  // 从配置选项中解构进入/退出全屏时的回调函数和页面全屏选项
  const { onExit, onEnter, pageFullscreen = false } = options || {};
  // 从页面全屏选项中解构类名和层级
  const { className = 'hooks-page-fullscreen', zIndex = 999999 } =
    isBoolean(pageFullscreen) || !pageFullscreen ? {} : pageFullscreen;

  // 使用 useLatest Hook 创建保存进入/退出全屏时的回调函数的引用
  const onExitRef = useLatest(onExit);
  const onEnterRef = useLatest(onEnter);

  // 使用 useRef Hook 创建保存全屏状态的引用，并根据当前状态动态初始化
  const [state, setState] = useState(getIsFullscreen);
  const stateRef = useRef(getIsFullscreen());

  // 获取当前全屏状态的函数
  function getIsFullscreen() {
    return (
      screenfull.isEnabled &&
      !!screenfull.element &&
      screenfull.element === getTargetElement(target)
    );
  }

  // 调用回调函数的函数
  const invokeCallback = (fullscreen: boolean) => {
    if (fullscreen) {
      onEnterRef.current?.();
    } else {
      onExitRef.current?.();
    }
  };

  // 更新全屏状态的函数
  const updateFullscreenState = (fullscreen: boolean) => {
    // 防止在状态未改变时重复调用
    if (stateRef.current !== fullscreen) {
      invokeCallback(fullscreen);
      setState(fullscreen);
      stateRef.current = fullscreen;
    }
  };

  // 全屏状态变化时的回调函数
  const onScreenfullChange = () => {
    const fullscreen = getIsFullscreen();
    updateFullscreenState(fullscreen);
  };

  // 切换页面全屏状态的函数
  const togglePageFullscreen = (fullscreen: boolean) => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    let styleElem = document.getElementById(className);

    if (fullscreen) {
      // @ts-ignore
      el.classList.add(className);

      if (!styleElem) {
        styleElem = document.createElement('style');
        styleElem.setAttribute('id', className);
        styleElem.textContent = `
          .${className} {
            position: fixed; left: 0; top: 0; right: 0; bottom: 0;
            width: 100% !important; height: 100% !important;
            z-index: ${zIndex};
          }`;
        // @ts-ignore
        el.appendChild(styleElem);
      }
    } else {
      // @ts-ignore
      el.classList.remove(className);

      if (styleElem) {
        styleElem.remove();
      }
    }

    updateFullscreenState(fullscreen);
  };

  // 进入全屏的函数
  const enterFullscreen = () => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    if (pageFullscreen) {
      togglePageFullscreen(true);
      return;
    }
    if (screenfull.isEnabled) {
      try {
        // @ts-ignore
        screenfull.request(el);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 退出全屏的函数
  const exitFullscreen = () => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    if (pageFullscreen) {
      togglePageFullscreen(false);
      return;
    }
    if (screenfull.isEnabled && screenfull.element === el) {
      screenfull.exit();
    }
  };

  // 切换全屏状态的函数
  const toggleFullscreen = () => {
    if (state) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // 监听全屏状态变化的副作用
  useEffect(() => {
    if (!screenfull.isEnabled || pageFullscreen) {
      return;
    }

    screenfull.on('change', onScreenfullChange);

    return () => {
      // @ts-ignore
      screenfull.off('change', onScreenfullChange);
    };
  }, []);

  // 返回全屏状态及处理全屏事件的回调函数
  return [
    state,
    {
      enterFullscreen: useMemoizedFn(enterFullscreen),
      exitFullscreen: useMemoizedFn(exitFullscreen),
      toggleFullscreen: useMemoizedFn(toggleFullscreen),
      isEnabled: screenfull.isEnabled,
    },
  ] as const;
};

export default useFullscreen;
