export function getAspectRatio(base64Image: string) {
  return new Promise((resolve, reject) => {
    let img = new Image()

    img.onload = function () {
      let aspectRatio = img.width / img.height
      resolve(aspectRatio)
      img.remove()
    }
    img.onerror = function () {
      reject(new Error('Could not load image'))
      img.remove()
    }
    img.src = base64Image
  })
}
