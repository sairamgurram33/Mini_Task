import React from "react";

/**
 * Pagination component with prev/next and page number buttons.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page range: always show first, last, current ±1
  function getPages() {
    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) pages.add(i);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  const pages = getPages();

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && <span className="px-2 text-gray-400">…</span>}
            <button
              className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onPageChange(p)}
              aria-current={currentPage === p ? "page" : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
