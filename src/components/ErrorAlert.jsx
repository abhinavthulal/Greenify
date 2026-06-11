export default function ErrorAlert({ message, onClose }) {
  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex justify-between items-start gap-4">
      <div>
        <h3 className="font-semibold text-red-800 dark:text-red-200">Error</h3>
        <p className="text-red-700 dark:text-red-300">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-2xl leading-none"
      >
        ×
      </button>
    </div>
  )
}
