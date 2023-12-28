import fs from 'fs'
export async function isExists(dir: string) {
  if (!fs.existsSync(dir)) {
    return await fs.promises.mkdir(dir)
  }
}
