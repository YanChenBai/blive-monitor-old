/**
 * @jest-environment jsdom
 */

import { ref } from '../live/assets/tools'

test('响应式代理', () => {
  const str = ref('123132', (newValue) => {
    document.body.innerHTML = newValue
  })
  str.value = '456'
  expect(str.value).toBe('456')
  expect(document.body.innerHTML).toBe('456')
})
