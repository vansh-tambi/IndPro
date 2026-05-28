import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, stage, onEditTask, onDeleteTask, onStageChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStageChange(taskId, stage);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-full border rounded-lg p-4 flex-1 min-h-[400px] transition-colors duration-150 ${
        isDragOver ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          <span className="text-[10px] font-bold bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStageChange={onStageChange}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
            No tasks in this stage
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
