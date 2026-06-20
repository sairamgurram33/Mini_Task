import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import StatsBar from "../components/StatsBar";
import { fetchTasks, fetchStats, updateTaskStatus, deleteTask } from "../services/taskService";

const FILTERS = ["All", "Pending", "In Progress", "Completed"];
const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await fetchStats();
      setStats(s);
    } catch {
      // Stats are non-critical, fail silently
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async (opts = {}) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchTasks({
        status: opts.status ?? (activeFilter === "All" ? "" : activeFilter),
        search: opts.search ?? search,
        sort: opts.sort ?? sort,
        page: opts.page ?? page,
        limit: ITEMS_PER_PAGE,
      });
      setTasks(result.tasks);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setPage(result.page);
    } catch (err) {
      setError("Failed to load tasks. Please check your connection.");
      console.error("Task loading error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, sort, page]);

  // Initial load
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  // Reload when filter / sort / page changes
  useEffect(() => {
    loadTasks({ status: activeFilter === "All" ? "" : activeFilter, page: 1 });
    setPage(1);
  }, [activeFilter, sort]);

  // Debounced search
  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
      loadTasks({ search: val, status: activeFilter === "All" ? "" : activeFilter, page: 1 });
    }, 350);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    loadTasks({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleComplete(id) {
    try {
      await updateTaskStatus(id, "Completed");
      await loadTasks({ page });
      await loadStats();
    } catch {
      setError("Failed to update task");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      // If last item on page > 1, go back
      const newPage = tasks.length === 1 && page > 1 ? page - 1 : page;
      await loadTasks({ page: newPage });
      await loadStats();
    } catch {
      setError("Failed to delete task");
    }
  }

  const clearSearch = () => {
    setSearchInput(""); 
    setSearch(""); 
    setPage(1);
    loadTasks({ search: "", status: activeFilter === "All" ? "" : activeFilter, page: 1 });
  };

  const retryLoad = () => {
    loadTasks(); 
    loadStats();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Manage and track your project tasks with ease
          </p>
        </div>
        
        <Link to="/add" className="btn btn-primary btn-lg">
          + Create New Task
        </Link>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} loading={statsLoading} />

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Connection Error</h3>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={retryLoad}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search & Controls */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <input
              type="search"
              className="form-input pl-4 pr-12 w-full"
              placeholder="Search tasks by title or description..."
              value={searchInput}
              onChange={handleSearchChange}
              aria-label="Search tasks"
            />
            {searchInput && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
            <select 
              className="form-select min-w-40"
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort tasks"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count */}
      {!loading && !error && total > 0 && (
        <div className="task-count-display mb-6">
          <div className="task-count-text">
            <span className="task-count-label">Showing</span>
            <span className="task-count-number">{tasks.length}</span>
            <span className="task-count-label">of</span>
            <span className="task-count-number">{total}</span>
            <span className="task-count-label">task{total !== 1 ? "s" : ""}</span>
            {search && (
              <span className="task-count-label"> for "{search}"</span>
            )}
          </div>
        </div>
      )}
      {!loading && !error && total === 0 && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
          No tasks found
        </div>
      )}

      {/* Task Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState filter={activeFilter} search={search} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={handleComplete} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
