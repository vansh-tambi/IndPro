import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStageChange }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow duration-150 flex flex-col justify-between h-[148px] w-full cursor-grab active:cursor-grabbing"
    >
      <div className="overflow-hidden">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-slate-900 text-sm leading-tight truncate w-full" title={task.title}>
            {task.title}
          </h4>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
              title="Edit Task"
              aria-label="Edit task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
              title="Delete Task"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed break-words">
          {task.description || <span className="italic text-slate-350">No description</span>}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
        <span className="text-[10px] text-slate-450 font-medium">
          {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>

        <select
          value={task.stage}
          onChange={(e) => onStageChange(task._id, e.target.value)}
          aria-label="Change task stage"
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
        >
          <option value="Todo">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
