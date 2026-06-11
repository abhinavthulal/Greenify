export default function ProgressBar({ progress }) {
  return (
    <div className="card mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Overall Progress</h2>
        <span className="text-lg font-semibold text-green-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
