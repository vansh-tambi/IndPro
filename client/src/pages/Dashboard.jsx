import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import TaskColumn from '../components/TaskColumn';
import { Plus, X, BarChart2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', stage: 'Todo' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to retrieve tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentTask(null);
    setFormData({ title: '', description: '', stage: 'Todo' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setCurrentTask(task);
    setFormData({ title: task.title, description: task.description, stage: task.stage });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    setFormData({ title: '', description: '', stage: 'Todo' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentTask) {
        // Edit task
        const response = await api.put(`/tasks/${currentTask._id}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === currentTask._id ? response.data : t)));
        toast.success('Task updated successfully');
      } else {
        // Add task
        const response = await api.post('/tasks', formData);
        setTasks((prev) => [response.data, ...prev]);
        toast.success('Task created successfully');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Save previous state for rollback
    const previousTasks = [...tasks];
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(previousTasks); // Rollback
      toast.error('Failed to delete task');
    }
  };

  const handleMoveTask = async (id, newStage) => {
    // Save previous state for rollback
    const previousTasks = [...tasks];
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, stage: newStage } : t))
    );

    try {
      await api.put(`/tasks/${id}`, { stage: newStage });
    } catch (error) {
      console.error('Error moving task:', error);
      setTasks(previousTasks); // Rollback
      toast.error('Failed to move task');
    }
  };

  // Group tasks by stage
  const todoTasks = tasks.filter((t) => t.stage === 'Todo');
  const inProgressTasks = tasks.filter((t) => t.stage === 'In Progress');
  const doneTasks = tasks.filter((t) => t.stage === 'Done');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden pb-12">
      {/* Background decoration blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 mt-8 flex flex-col gap-8 relative z-10">
        
        {/* Top welcome and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white m-0">My Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Organize, track, and complete your daily goals.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-850">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Tasks</p>
              <h3 className="text-xl font-bold text-slate-200 mt-0.5">{tasks.length}</h3>
            </div>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Circle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">To Do</p>
              <h3 className="text-xl font-bold text-slate-200 mt-0.5">{todoTasks.length}</h3>
            </div>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">In Progress</p>
              <h3 className="text-xl font-bold text-slate-200 mt-0.5">{inProgressTasks.length}</h3>
            </div>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <h3 className="text-xl font-bold text-slate-200 mt-0.5">{doneTasks.length}</h3>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-slate-400 text-sm font-medium">Fetching tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <TaskColumn
              title="To Do"
              tasks={todoTasks}
              stage="Todo"
              colorClass="bg-indigo-500"
              onAddTask={handleOpenAddModal}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              stage="In Progress"
              colorClass="bg-amber-500"
              onAddTask={handleOpenAddModal}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
            <TaskColumn
              title="Completed"
              tasks={doneTasks}
              stage="Done"
              colorClass="bg-emerald-500"
              onAddTask={handleOpenAddModal}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          </div>
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleCloseModal}></div>
          
          {/* Modal Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {currentTask ? 'Edit Task' : 'Create New Task'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="title">
                  Task Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Design Landing Page"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe the task details..."
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {currentTask && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="stage">
                    Stage
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    value={formData.stage}
                    onChange={handleInputChange}
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 font-semibold text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>{currentTask ? 'Save Changes' : 'Create Task'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
