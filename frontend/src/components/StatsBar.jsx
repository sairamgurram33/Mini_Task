import React from "react";

const SkeletonCard = () => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
    <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

/**
 * Modern StatsBar — animated statistics cards showing task counts
 */
export default function StatsBar({ stats, loading }) {
  const items = [
    { 
      key: "total", 
      label: "Total Tasks", 
      val: stats?.total,
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
    },
    { 
      key: "pending", 
      label: "Pending", 
      val: stats?.pending,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
    },
    { 
      key: "inProgress", 
      label: "In Progress", 
      val: stats?.inProgress,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    { 
      key: "completed", 
      label: "Completed", 
      val: stats?.completed,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
    },
  ];

  const completionRate = stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Completion Rate Banner */}
      {stats?.total > 0 && (
        <div className="card mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Project Progress</h3>
                <p className="text-indigo-100">Overall completion rate</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">{completionRate}%</div>
              <div className="text-sm text-indigo-100">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        {items.map(({ key, label, val, gradient, bgGradient }) => (
          <div
            key={key}
            className={`stat-card ${key} relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-200`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`}></div>
            
            <div className="relative">
              {/* Icon and Value Row */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-xl">
                    {key === 'total' && '📋'}
                    {key === 'pending' && '⏳'}
                    {key === 'inProgress' && '🔄'}
                    {key === 'completed' && '✅'}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {val ?? 0}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="stat-label">
                {label}
              </div>

              {/* Progress indicator for individual stats */}
              {stats?.total > 0 && val > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((val / stats.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(100, (val / stats.total) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}