import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const TaskColumn = ({
  title,
  tasks,
  stage,
  colorClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask
}) => {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-280px)] min-h-[400px] min-w-[280px] bg-slate-900/10 border border-slate-900 rounded-2xl p-4 flex-1">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <span className="text-xs font-semibold bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {stage === 'Todo' && (
          <button
            onClick={onAddTask}
            className="flex items-center justify-center p-1.5 hover:bg-slate-900 rounded-lg text-indigo-400 hover:text-indigo-300 hover:scale-105 transition-all cursor-pointer"
            title="Add Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-800/60 rounded-xl p-4 text-center">
            <span className="text-xs text-slate-500 mb-1">No tasks here</span>
            {stage === 'Todo' && (
              <button
                onClick={onAddTask}
                className="text-xs text-indigo-400 hover:underline hover:text-indigo-300 font-medium mt-1 cursor-pointer"
              >
                Create a task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
