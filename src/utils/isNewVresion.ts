/**
 * 对比版本号
 * @param curVersion 当前版本
 * @param newVersion 新版本
 * @returns 是不是新版本
 */
export function isNewVresion(curVersion: string, newVersion: string) {
  const curVersionArr = curVersion.split('.')
  const newVersionArr = newVersion.split('.')
  const minLen = Math.min(curVersionArr.length, newVersionArr.length)
  for (let i = 0; i < minLen; i++) {
    const curNum = Number(curVersionArr[i])
    const newNum = Number(newVersionArr[i])
    if (curNum < newNum) {
      return true
    } else if (curNum > newNum) {
      return false
    }
  }
  return false
}
