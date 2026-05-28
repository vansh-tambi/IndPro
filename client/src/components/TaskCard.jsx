import React from 'react';
import { Edit2, Trash2, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onMove }) => {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="group bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between min-h-[140px]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-white transition-colors">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {task.description || <span className="italic text-slate-600">No description provided</span>}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          {task.stage !== 'Todo' && (
            <button
              onClick={() => onMove(task._id, task.stage === 'Done' ? 'In Progress' : 'Todo')}
              className="p-1 hover:bg-slate-850 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Move backward"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {task.stage !== 'Done' && (
            <button
              onClick={() => onMove(task._id, task.stage === 'Todo' ? 'In Progress' : 'Done')}
              className="p-1 hover:bg-slate-850 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Move forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
