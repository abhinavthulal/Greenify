// Web Worker for image processing

function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function isNearWhite(r, g, b, threshold = 230) {
  return r > threshold && g > threshold && b > threshold
}

function hasEdgeNearby(data, width, height, x, y, radius = 2) {
  // Simple edge detection using Sobel-like approach
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
      
      const idx = (ny * width + nx) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      
      // Check if this pixel is significantly different (edge)
      if (!isNearWhite(r, g, b, 230) && getLuminance(r, g, b) < 0.3) {
        return true
      }
    }
  }
  
  return false
}

function rgbToGreen(r, g, b) {
  const luminance = getLuminance(r, g, b)
  
  let color
  if (luminance > 0.7) {
    color = [116, 198, 157] // light green
  } else if (luminance > 0.4) {
    color = [47, 158, 68]   // medium green
  } else {
    color = [15, 122, 53]   // dark green
  }
  
  return color
}

self.onmessage = function(event) {
  const { imageData: rawData, width, height } = event.data
  const data = new Uint8ClampedArray(rawData)
  const result = new Uint8ClampedArray(data.length)
  
  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    
    const pixelIndex = i / 4
    const x = pixelIndex % width
    const y = Math.floor(pixelIndex / width)
    
    if (isNearWhite(r, g, b)) {
      // Check if this white area is near an edge (might be text or diagram element)
      if (hasEdgeNearby(data, width, height, x, y, 3)) {
        // Convert to green instead of removing
        const [gr, gg, gb] = rgbToGreen(255, 255, 255)
        result[i] = gr
        result[i + 1] = gg
        result[i + 2] = gb
        result[i + 3] = 255
      } else {
        // Remove background (transparent)
        result[i] = 0
        result[i + 1] = 0
        result[i + 2] = 0
        result[i + 3] = 0
      }
    } else {
      // Convert to green shades
      const [gr, gg, gb] = rgbToGreen(r, g, b)
      result[i] = gr
      result[i + 1] = gg
      result[i + 2] = gb
      result[i + 3] = a
    }
  }
  
  self.postMessage({
    data: result,
    width,
    height,
  })
}
