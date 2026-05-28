import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import Navbar from '../components/Navbar';
import StageSection from '../components/StageSection';
import EditTaskPopup from '../components/EditTaskPopup';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    if (isSaving) return;
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
      setIsModalOpen(false);
      setCurrentTask(null);
      setTitle('');
      setDescription('');
      setStage('Todo');
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const targetStage = over.id;

    const activeTask = tasks.find(t => t._id === taskId);
    if (activeTask && activeTask.stage !== targetStage) {
      handleStageChange(taskId, targetStage);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todoTasks = filteredTasks.filter((t) => t.stage === 'Todo');
  const inProgressTasks = filteredTasks.filter((t) => t.stage === 'In Progress');
  const doneTasks = filteredTasks.filter((t) => t.stage === 'Done');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Workspace</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track your ongoing progress and priorities.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <input
              type="text"
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-550 w-full sm:w-48 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-650"></div>
            <span className="text-xs text-slate-500 font-medium">Loading board...</span>
          </div>
        ) : (
          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              <StageSection
                title="To Do"
                tasks={todoTasks}
                stage="Todo"
                onEditTask={openEditModal}
                onDeleteTask={handleDelete}
                onStageChange={handleStageChange}
              />
              <StageSection
                title="In Progress"
                tasks={inProgressTasks}
                stage="In Progress"
                onEditTask={openEditModal}
                onDeleteTask={handleDelete}
                onStageChange={handleStageChange}
              />
              <StageSection
                title="Completed"
                tasks={doneTasks}
                stage="Done"
                onEditTask={openEditModal}
                onDeleteTask={handleDelete}
                onStageChange={handleStageChange}
              />
            </div>
          </DndContext>
        )}
      </main>

      <EditTaskPopup
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        stage={stage}
        setStage={setStage}
        isSaving={isSaving}
        isEdit={!!currentTask}
      />
    </div>
  );
};

export default Dashboard;
