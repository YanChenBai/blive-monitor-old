/**
 * 响应式变量
 * @param targetElement
 * @param value
 * @returns
 */
export function ref<T>(value: T, func: (newValue: T) => void, immediately = false) {
  if (immediately === true) func(value)
  return new Proxy(
    { value },
    {
      get(target) {
        return target.value
      },
      set(target, _prop, newValue, _receiver) {
        target.value = newValue
        func(newValue)
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
  if (wrapper) wrapper.innerHTML = template
  else {
    wrapper = document.createElement('div')
    wrapper.innerHTML = template
    document.body.appendChild(wrapper)
  }
}
