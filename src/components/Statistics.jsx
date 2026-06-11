import { useState, useEffect } from 'react'
import { getStats, getDailyStats } from '../utils/db'

export default function Statistics() {
  const [stats, setStats] = useState({
    today: 0,
    total: 0,
    visitors: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [daily, overall] = await Promise.all([
        getDailyStats(),
        getStats(),
      ])

      setStats({
        today: daily,
        total: overall.photosTotal,
        visitors: overall.visitorsTotal,
      })
    }

    fetchStats()

    // Refresh stats every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.today}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Photos Today</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Photos</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.visitors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Visitors</div>
        </div>
      </div>
    </div>
  )
}
