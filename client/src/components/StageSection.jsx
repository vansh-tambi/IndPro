import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskItem from './TaskItem';

const StageSection = ({ title, tasks, stage, onEditTask, onDeleteTask, onStageChange }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full border rounded-lg p-4 flex-1 min-h-[400px] transition-colors duration-155 ${
        isOver ? 'bg-slate-100 border-slate-350 shadow-xs' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          <span className="text-[10px] font-bold bg-slate-200/80 text-slate-650 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStageChange={onStageChange}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs text-center px-4">
            {stage === 'Todo' 
              ? 'No tasks yet' 
              : stage === 'In Progress' 
                ? 'No tasks in progress' 
                : 'Nothing completed yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default StageSection;
