import { useEffect, useState } from 'react';
import isBrowser from '../utils/isBrowser';

// 定义订阅者类型，用于处理响应式变化时的回调函数
type Subscriber = () => void;

// 创建订阅者集合，用于存储所有订阅响应式变化的回调函数
const subscribers = new Set<Subscriber>();

// 定义响应式配置类型和响应式信息类型
type ResponsiveConfig = Record<string, number>;
type ResponsiveInfo = Record<string, boolean>;

// 声明响应式信息和配置
let info: ResponsiveInfo;
let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// 处理窗口大小变化的函数
function handleResize() {
  const oldInfo = info;
  calculate(); // 计算响应式信息
  if (oldInfo === info) return; // 如果信息未改变，则不执行后续操作
  for (const subscriber of subscribers) {
    subscriber(); // 触发订阅者的回调函数
  }
}

// 是否正在监听窗口大小变化的标志
let listening = false;

// 计算响应式信息的函数
function calculate() {
  const width = window.innerWidth; // 获取当前窗口宽度
  const newInfo = {} as ResponsiveInfo;
  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    // 根据配置判断当前窗口尺寸对应的响应式信息
    newInfo[key] = width >= responsiveConfig[key];
    // 检查新的响应式信息是否与之前的信息不同，以确定是否需要更新
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  // 如果需要更新响应式信息，则将新信息赋值给全局变量
  if (shouldUpdate) {
    info = newInfo;
  }
}

// 配置响应式参数的函数
export function configResponsive(config: ResponsiveConfig) {
  responsiveConfig = config; // 更新全局的响应式配置
  if (info) calculate(); // 如果已有响应式信息，则重新计算
}

// 自定义 Hook：用于获取当前窗口尺寸对应的响应式信息
export function useResponsive() {
  if (isBrowser && !listening) {
    info = {}; // 初始化响应式信息
    calculate(); // 计算初始的响应式信息
    window.addEventListener('resize', handleResize); // 监听窗口大小变化事件
    listening = true; // 设置正在监听标志为 true
  }
  const [state, setState] = useState<ResponsiveInfo>(info); // 使用状态管理当前响应式信息

  useEffect(() => {
    if (!isBrowser) return; // 非浏览器环境直接返回

    if (!listening) {
      window.addEventListener('resize', handleResize); // 在尚未监听窗口大小变化时，添加监听器
    }

    // 创建订阅响应式变化的回调函数
    const subscriber = () => {
      setState(info); // 更新响应式信息状态
    };

    subscribers.add(subscriber); // 将回调函数添加到订阅者集合中
    return () => {
      subscribers.delete(subscriber); // 组件卸载时，从订阅者集合中移除回调函数
      if (subscribers.size === 0) {
        window.removeEventListener('resize', handleResize); // 如果订阅者集合为空，则移除窗口大小变化监听器
        listening = false; // 更新正在监听标志为 false
      }
    };
  }, []);

  return state; // 返回当前响应式信息状态
}
