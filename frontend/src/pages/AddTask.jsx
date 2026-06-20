import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTasks, 
  FaClock, 
  FaSpinner, 
  FaFlag,
  FaCalendarAlt,
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { createTask } from "../services/taskService";

const INITIAL = { 
  title: "", 
  description: "", 
  status: "Pending", 
  priority: "Medium",
  dueDate: "" 
};
const DESC_MIN = 20;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function AddTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const e = {};
    
    if (!form.title.trim()) {
      e.title = "Title is required";
    } else if (form.title.trim().length > 100) {
      e.title = "Title must be 100 characters or less";
    }
    
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < DESC_MIN) {
      e.description = `Description must be at least ${DESC_MIN} characters`;
    }

    if (form.dueDate && new Date(form.dueDate) < new Date().setHours(0,0,0,0)) {
      e.dueDate = "Due date cannot be in the past";
    }
    
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const ve = validate();
    if (Object.keys(ve).length) { 
      setErrors(ve); 
      toast.error("Please fix the errors before submitting");
      return; 
    }
    
    setSubmitting(true);
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null
      });
      
      toast.success("Task created successfully!");
      navigate("/");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
        toast.error("Please fix the validation errors");
      } else {
        const message = err.response?.data?.message || "Failed to create task";
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const descLen = form.description.length;
  const descValid = descLen >= DESC_MIN;
  const titleValid = form.title.length > 0 && form.title.length <= 100;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Modern Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <FaPlus className="text-lg" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">
              Create New Task
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Add a new task to your project management workflow
            </p>
          </div>
        </div>

        <Link to="/" className="btn btn-secondary">
          <FaArrowLeft />
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Modern Form */}
      <motion.div
        className="card max-w-4xl"
        variants={itemVariants}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <FaTasks className="text-indigo-500" />
              Task Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Title */}
              <motion.div 
                className="form-group lg:col-span-2"
                variants={itemVariants}
              >
                <label htmlFor="title" className="form-label">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    id="title" 
                    name="title" 
                    type="text"
                    className={`form-input pr-16 ${errors.title ? 'border-red-500' : titleValid ? 'border-emerald-500' : ''}`}
                    placeholder="Enter a descriptive title for your task..."
                    value={form.title} 
                    onChange={handleChange}
                    maxLength={100} 
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {titleValid && <FaCheckCircle className="text-emerald-500" />}
                    <span className={`text-sm ${form.title.length > 90 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                      {form.title.length}/100
                    </span>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      className="form-error flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FaExclamationCircle />
                      {errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Status */}
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="status" className="form-label">
                  Initial Status
                </label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status"
                    className="form-select pl-12"
                    value={form.status} 
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {form.status === 'Pending' ? (
                      <FaClock className="text-amber-500" />
                    ) : (
                      <FaSpinner className="text-blue-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tasks can be marked as Completed from the Dashboard
                </p>
              </motion.div>

              {/* Priority */}
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="priority" className="form-label">
                  Priority Level
                </label>
                <div className="relative">
                  <select 
                    id="priority" 
                    name="priority"
                    className="form-select pl-12"
                    value={form.priority} 
                    onChange={handleChange}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <FaFlag className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    form.priority === 'High' ? 'text-red-500' : 
                    form.priority === 'Medium' ? 'text-amber-500' : 'text-gray-500'
                  }`} />
                </div>
              </motion.div>

              {/* Due Date */}
              <motion.div className="form-group lg:col-span-2" variants={itemVariants}>
                <label htmlFor="dueDate" className="form-label">
                  Due Date (Optional)
                </label>
                <div className="relative">
                  <input 
                    id="dueDate" 
                    name="dueDate" 
                    type="date"
                    className={`form-input pl-12 ${errors.dueDate ? 'border-red-500' : ''}`}
                    value={form.dueDate} 
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <AnimatePresence>
                  {errors.dueDate && (
                    <motion.p
                      className="form-error flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FaExclamationCircle />
                      {errors.dueDate}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Description Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Task Description
            </h3>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="description" 
                name="description"
                className={`form-textarea min-h-32 ${errors.description ? 'border-red-500' : descValid ? 'border-emerald-500' : ''}`}
                placeholder="Provide a detailed description of what needs to be accomplished, including any specific requirements, context, or acceptance criteria..."
                value={form.description} 
                onChange={handleChange}
                rows={6}
              />
              
              <div className="flex items-center justify-between mt-2">
                <div className={`text-sm flex items-center gap-2 ${
                  descLen === 0 ? 'text-gray-400' : 
                  descValid ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'
                }`}>
                  {descValid ? (
                    <FaCheckCircle className="text-emerald-500" />
                  ) : descLen > 0 ? (
                    <FaExclamationCircle className="text-red-500" />
                  ) : null}
                  <span>
                    {descLen} / {DESC_MIN} characters minimum
                  </span>
                </div>

                <div className="text-sm text-gray-400">
                  {descLen > 0 && (
                    <span>
                      {Math.ceil(descLen / 5)} words approximately
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {errors.description && (
                  <motion.p
                    className="form-error flex items-center gap-2 mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FaExclamationCircle />
                    {errors.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div 
            className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            
            <motion.button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Task
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
