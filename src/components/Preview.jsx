export default function Preview({ original, processed }) {
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Preview</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Original</h3>
          {original && (
            <img
              src={original}
              alt="Original"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
            />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Processed</h3>
          {processed ? (
            <img
              src={processed}
              alt="Processed"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 object-contain bg-gray-100 dark:bg-gray-800"
            />
          ) : (
            <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
