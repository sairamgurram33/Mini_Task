import React from "react";

/**
 * LoadingSpinner — shown while data is being fetched
 */
export default function LoadingSpinner({ message = "Loading tasks..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-16" role="status" aria-live="polite">
      <div className="loading-spinner mb-4" aria-hidden="true" />
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </div>
  );
}
