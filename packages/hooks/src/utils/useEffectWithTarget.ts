import { useEffect } from 'react';
import createEffectWithTarget from './createEffectWithTarget';

/**
 * 自定义的 useEffect，支持指定目标对象
 * @param effect 副作用函数
 * @param target 目标对象或目标对象数组
 */
const useEffectWithTarget = createEffectWithTarget(useEffect);

export default useEffectWithTarget;
