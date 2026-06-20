import React, { useState } from "react";

function getStatusConfig(status) {
  switch (status) {
    case "Pending": 
      return {
        badge: "bg-amber-100 text-amber-600 border-amber-200",
        card: "border-l-amber-400",
        color: "text-amber-600"
      };
    case "In Progress": 
      return {
        badge: "bg-blue-100 text-blue-600 border-blue-200", 
        card: "border-l-blue-400",
        color: "text-blue-600"
      };
    case "Completed": 
      return {
        badge: "bg-emerald-100 text-emerald-600 border-emerald-200",
        card: "border-l-emerald-400", 
        color: "text-emerald-600"
      };
    default: 
      return {
        badge: "bg-amber-100 text-amber-600 border-amber-200",
        card: "border-l-amber-400",
        color: "text-amber-600"
      };
  }
}

export default function TaskCard({ task, onComplete, onDelete }) {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  const statusConfig = getStatusConfig(task.status);
  const isCompleted = task.status === "Completed";

  async function handleComplete() {
    if (isCompleted) return;
    
    setLoadingComplete(true);
    try {
      await onComplete(task.id);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setLoadingComplete(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"?\n\nThis action cannot be undone.`)) return;
    
    setLoadingDelete(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoadingDelete(false);
    }
  }

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

  return (
    <div className={`card relative overflow-hidden ${statusConfig.card} border-l-4`}>
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
          <span>{task.status}</span>
        </div>
      </div>

      {/* Task Header */}
      <div className="mb-4 pr-24">
        <h3 className={`text-lg font-bold text-gray-900 dark:text-white leading-tight ${
          isCompleted ? 'line-through opacity-60' : ''
        }`}>
          {task.title}
        </h3>

        {/* Priority Badge */}
        {task.priority && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              task.priority === 'High' ? 'bg-red-100 text-red-600' :
              task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {task.priority} Priority
            </span>
          </div>
        )}
      </div>

      {/* Task Description */}
      <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 ${
        isCompleted ? 'opacity-60' : ''
      }`}>
        {task.description}
      </p>

      {/* Task Meta Information */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-4">
          <span>Created {formatDate(task.created_at)}</span>
          {task.due_date && (
            <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
              Due {formatDate(task.due_date)}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        {!isCompleted && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleComplete}
            disabled={loadingComplete || loadingDelete}
            title="Mark as completed"
          >
            {loadingComplete ? "..." : "✓ Complete"}
          </button>
        )}
        
        <button
          className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleDelete}
          disabled={loadingComplete || loadingDelete}
          title="Delete task"
        >
          {loadingDelete ? "..." : "🗑 Delete"}
        </button>
      </div>

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 pointer-events-none flex items-center justify-center">
          <div className="bg-emerald-500 text-white rounded-full p-3 shadow-lg">
            <span className="text-2xl">✓</span>
          </div>
        </div>
      )}
    </div>
  );
}
