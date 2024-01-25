import { isNewVresion } from '../isNewVresion'

test('响应式代理', () => {
  expect(isNewVresion('0.0.8', '0.0.9')).toBe(true)
  expect(isNewVresion('0.1.8', '0.0.9')).toBe(false)
  expect(isNewVresion('0.0.8', '0.1.9')).toBe(true)
  expect(isNewVresion('1.0.8', '0.1.9')).toBe(false)
  expect(isNewVresion('1.0.8', '1.1.9')).toBe(true)
  expect(isNewVresion('1.1.9', '1.1.9')).toBe(false)
})
