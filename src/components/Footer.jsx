export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All image processing happens in your browser. Images are never stored on our servers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How It Works</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Images are converted to green shades and white backgrounds are removed automatically using advanced pixel-level processing.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only anonymous counters are stored. No personal information is collected or tracked.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 Greenify Batch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
