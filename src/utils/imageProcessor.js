// Image processing utilities

const GREEN_PALETTE = {
  dark: [15, 122, 53],      // #0F7A35
  medium: [47, 158, 68],    // #2F9E44
  light: [116, 198, 157],   // #74C69D
}

export function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function isNearWhite(r, g, b, threshold = 230) {
  return r > threshold && g > threshold && b > threshold
}

export function rgbToGreen(r, g, b) {
  const luminance = getLuminance(r, g, b)
  
  let color
  if (luminance > 0.7) {
    color = GREEN_PALETTE.light
  } else if (luminance > 0.4) {
    color = GREEN_PALETTE.medium
  } else {
    color = GREEN_PALETTE.dark
  }
  
  return color
}

export async function processImageWithWorker(imageData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/imageWorker.js', import.meta.url), { type: 'module' })
    
    worker.onmessage = (event) => {
      worker.terminate()
      resolve(event.data)
    }
    
    worker.onerror = (error) => {
      worker.terminate()
      reject(error)
    }
    
    worker.postMessage({
      imageData: imageData.data,
      width: imageData.width,
      height: imageData.height,
    })
  })
}

export async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        resolve({
          canvas,
          imageData: ctx.getImageData(0, 0, img.width, img.height),
          width: img.width,
          height: img.height,
          filename: file.name,
        })
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
}

export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getOutputFilename(inputFilename) {
  const nameParts = inputFilename.split('.')
  const extension = nameParts.pop()
  const baseName = nameParts.join('.')
  return `${baseName}green.png`
}
