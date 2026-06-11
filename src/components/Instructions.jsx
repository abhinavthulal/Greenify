export default function Instructions() {
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4">How to Use</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Simple Steps</h3>
          <ol className="space-y-2">
            <li className="flex gap-3">
              <span className="font-bold text-green-medium min-w-6">1.</span>
              <span>Select or paste up to 10 images</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-medium min-w-6">2.</span>
              <span>Processing starts automatically</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-medium min-w-6">3.</span>
              <span>Watch the progress bar update</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-medium min-w-6">4.</span>
              <span>Files download automatically as PNG</span>
            </li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Best For</h3>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Technical diagrams and flowcharts</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Circuit diagrams and electronics</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Screenshots and code examples</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Scanned documents and handwriting</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm">
          💡 <strong>Keyboard shortcut:</strong> Press <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Ctrl+V</kbd> (or <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Cmd+V</kbd> on Mac) to paste images from your clipboard.
        </p>
      </div>
    </div>
  )
}
