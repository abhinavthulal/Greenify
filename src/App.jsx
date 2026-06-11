import React, { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import UploadArea from './components/UploadArea'
import QueueStatus from './components/QueueStatus'
import ProgressBar from './components/ProgressBar'
import Preview from './components/Preview'
import Statistics from './components/Statistics'
import Instructions from './components/Instructions'
import Footer from './components/Footer'
import ErrorAlert from './components/ErrorAlert'

import { loadImage, processImageWithWorker, canvasToBlob, downloadFile, getOutputFilename } from './utils/imageProcessor'
import { incrementPhotoCount, incrementVisitor } from './utils/db'

export default function App() {
  const [queue, setQueue] = useState([])
  const [processing, setProcessing] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(null)
  const [stats, setStats] = useState({ today: 0, total: 0, visitors: 0 })
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState({ original: null, processed: null })
  const processingRef = useRef(false)

  // Initialize: increment visitor count
  useEffect(() => {
    incrementVisitor()
  }, [])

  const addImagesToQueue = useCallback((files) => {
    if (files.length === 0) return

    if (queue.length + files.length > 10) {
      setError('Maximum 10 images allowed. Current queue would exceed this limit.')
      return
    }

    const newItems = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      file,
      status: 'waiting', // waiting, processing, completed, failed
      progress: 0,
    }))

    setQueue(prev => [...prev, ...newItems])
    setError(null)
  }, [queue])

  const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items
    if (!items) return

    const files = []
    for (let item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file && file.type.startsWith('image/')) {
          files.push(file)
        }
      }
    }

    if (files.length > 0) {
      addImagesToQueue(files)
    } else if (items.length > 0) {
      setError('No valid images found in clipboard')
    }
  }, [addImagesToQueue])

  const handleFileSelect = useCallback((event) => {
    const files = event.target.files
    if (files) {
      addImagesToQueue(Array.from(files))
      event.target.value = '' // Reset input
    }
  }, [addImagesToQueue])

  const processQueue = useCallback(async () => {
    if (processingRef.current || queue.length === 0) return
    
    processingRef.current = true
    setProcessing(true)

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      if (item.status !== 'waiting') continue

      try {
        setCurrentImageIndex(i)
        
        // Update status to processing
        setQueue(prev => {
          const newQueue = [...prev]
          newQueue[i] = { ...newQueue[i], status: 'processing' }
          return newQueue
        })

        // Load image
        const imageInfo = await loadImage(item.file)

        // Show preview
        setPreview({
          original: imageInfo.canvas.toDataURL(),
          processed: null,
        })

        // Process with worker
        const processedData = await processImageWithWorker(imageInfo.imageData)

        // Create result canvas
        const resultCanvas = document.createElement('canvas')
        resultCanvas.width = processedData.width
        resultCanvas.height = processedData.height
        const ctx = resultCanvas.getContext('2d')

        const imgData = new ImageData(processedData.data, processedData.width, processedData.height)
        ctx.putImageData(imgData, 0, 0)

        // Compress if needed
        const blob = await canvasToBlob(resultCanvas)
        const compressedBlob = await compressIfNeeded(blob, resultCanvas)

        // Update preview
        setPreview(prev => ({
          ...prev,
          processed: resultCanvas.toDataURL(),
        }))

        // Download
        const outputFilename = getOutputFilename(item.file.name)
        downloadFile(compressedBlob, outputFilename)

        // Update status
        setQueue(prev => {
          const newQueue = [...prev]
          newQueue[i] = { ...newQueue[i], status: 'completed' }
          return newQueue
        })

        // Increment counter
        await incrementPhotoCount(1)

      } catch (err) {
        console.error('Error processing image:', err)
        setQueue(prev => {
          const newQueue = [...prev]
          newQueue[i] = { ...newQueue[i], status: 'failed' }
          return newQueue
        })
      }

      // Small delay between images
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    processingRef.current = false
    setProcessing(false)
    setCurrentImageIndex(null)
  }, [queue])

  async function compressIfNeeded(blob, canvas) {
    if (blob.size <= 500 * 1024) {
      return blob
    }

    // Try with slightly lower quality
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png', 0.9)
    })
  }

  // Process queue when it changes
  useEffect(() => {
    if (queue.length > 0 && !processing) {
      processQueue()
    }
  }, [queue, processing, processQueue])

  // Listen for paste events
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const completed = queue.filter(q => q.status === 'completed').length
  const failed = queue.filter(q => q.status === 'failed').length
  const waiting = queue.filter(q => q.status === 'waiting').length
  const isCurrentlyProcessing = queue.filter(q => q.status === 'processing').length > 0

  const progress = queue.length > 0 ? (completed / queue.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <UploadArea onFileSelect={handleFileSelect} />

        {queue.length > 0 && (
          <>
            <QueueStatus
              waiting={waiting}
              processing={isCurrentlyProcessing ? 1 : 0}
              completed={completed}
              failed={failed}
            />

            <ProgressBar progress={progress} />

            {preview.original && (
              <Preview original={preview.original} processed={preview.processed} />
            )}
          </>
        )}

        <Statistics stats={stats} />

        <Instructions />
      </main>

      <Footer />
    </div>
  )
}
