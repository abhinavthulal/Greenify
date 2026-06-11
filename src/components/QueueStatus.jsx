export default function QueueStatus({ waiting, processing, completed, failed }) {
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Queue Status</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{waiting}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Waiting</div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{processing}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>

        {failed > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{failed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
          </div>
        )}
      </div>
    </div>
  )
}
