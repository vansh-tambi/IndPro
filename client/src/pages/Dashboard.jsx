import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskColumn from '../components/TaskColumn';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('Todo');
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const openCreateModal = () => {
    setCurrentTask(null);
    setTitle('');
    setDescription('');
    setStage('Todo');
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStage(task.stage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    setTitle('');
    setDescription('');
    setStage('Todo');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    setIsSaving(true);
    try {
      if (currentTask) {
        const updated = await updateTask(currentTask._id, { title, description, stage });
        setTasks((prev) => prev.map((t) => (t._id === currentTask._id ? updated : t)));
        toast.success('Task updated.');
      } else {
        const created = await createTask({ title, description, stage });
        setTasks((prev) => [created, ...prev]);
        toast.success('Task created.');
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task removed.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task.');
    }
  };

  const handleStageChange = async (id, newStage) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, stage: newStage } : t))
    );

    try {
      await updateTask(id, { stage: newStage });
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
      toast.error('Failed to move task.');
    }
  };

  const todoTasks = tasks.filter((t) => t.stage === 'Todo');
  const inProgressTasks = tasks.filter((t) => t.stage === 'In Progress');
  const doneTasks = tasks.filter((t) => t.stage === 'Done');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Workspace</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track your ongoing progress and priorities.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-650"></div>
            <span className="text-xs text-slate-500 font-medium">Loading board...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <TaskColumn
              title="To Do"
              tasks={todoTasks}
              stage="Todo"
              onEditTask={openEditModal}
              onDeleteTask={handleDelete}
              onStageChange={handleStageChange}
            />
            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              stage="In Progress"
              onEditTask={openEditModal}
              onDeleteTask={handleDelete}
              onStageChange={handleStageChange}
            />
            <TaskColumn
              title="Completed"
              tasks={doneTasks}
              stage="Done"
              onEditTask={openEditModal}
              onDeleteTask={handleDelete}
              onStageChange={handleStageChange}
            />
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs" onClick={closeModal}></div>

          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-sm p-6 shadow-md relative z-10">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-900 mb-4">
              {currentTask ? 'Edit Task' : 'New Task'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Task title"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Optional details"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {currentTask && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="stage">
                    Stage
                  </label>
                  <select
                    id="stage"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm cursor-pointer"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Completed</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save'}
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
