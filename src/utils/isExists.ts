import fs from 'fs'
export async function isExists(dir: string) {
  const state = fs.existsSync(dir)
  if (!state) {
    return await fs.promises.mkdir(dir)
  }
}
