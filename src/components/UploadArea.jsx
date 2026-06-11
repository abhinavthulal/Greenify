import { useRef } from 'react'

export default function UploadArea({ onFileSelect }) {
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.add('border-green-medium', 'bg-green-light', 'bg-opacity-10')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('border-green-medium', 'bg-green-light', 'bg-opacity-10')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('border-green-medium', 'bg-green-light', 'bg-opacity-10')
    
    const files = e.dataTransfer.files
    if (files) {
      onFileSelect({ target: { files } })
    }
  }

  return (
    <div className="card mb-6">
      <h2 className="text-2xl font-bold mb-6">Upload Images</h2>
      
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold mb-2">Choose Files or Drag & Drop</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click here to select images from your computer
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Supported formats: PNG, JPG, JPEG, WEBP
        </p>
        <p className="text-sm font-medium text-green-medium">
          Maximum 10 images per batch
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />

        <button
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          className="btn-primary mt-4"
        >
          Select Files
        </button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        💡 Tip: You can also paste images using Ctrl+V (Cmd+V on Mac)
      </p>
    </div>
  )
}
