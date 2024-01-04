export interface Ref<T> {
  value: T
}

/**
 * 响应式变量
 * @param targetElement
 * @param value
 * @returns
 */
export function ref<T>(value: T, func?: (newValue: T) => void, immediately = false): Ref<T> {
  // 执行函数
  const execFunc = (val: T) => (func && typeof func === 'function' ? func(val) : '')
  if (immediately) execFunc(value)
  return new Proxy(
    { value },
    {
      get(target) {
        return target.value
      },
      set(target, _prop, newValue, _receiver) {
        target.value = newValue
        execFunc(newValue)
        return true
      }
    }
  )
}

/** 创建dom插入容器
 * @param template 字符串模板
 * @param wrapper 容器
 */
export function createDom(template: string, wrapper?: HTMLElement) {
  if (wrapper) {
    wrapper.innerHTML = template
    return wrapper
  } else {
    wrapper = document.createElement('div')
    wrapper.innerHTML = template
    return document.body.appendChild(wrapper)
  }
}
