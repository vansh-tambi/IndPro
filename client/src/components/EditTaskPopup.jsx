import React from 'react';
import { X } from 'lucide-react';

const EditTaskPopup = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  stage,
  setStage,
  isSaving,
  isEdit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs" 
        onClick={onClose}
      ></div>

      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-sm p-6 shadow-md relative z-10">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1 rounded-lg cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {isEdit ? 'Edit Task' : 'New Task'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="popup-title">
              Title
            </label>
            <input
              id="popup-title"
              type="text"
              required
              disabled={isSaving}
              placeholder="Task title"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm disabled:bg-slate-50 disabled:text-slate-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="popup-description">
              Description
            </label>
            <textarea
              id="popup-description"
              rows={3}
              disabled={isSaving}
              placeholder="Optional details"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-955 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm resize-none disabled:bg-slate-50 disabled:text-slate-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {isEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="popup-stage">
                Stage
              </label>
              <select
                id="popup-stage"
                disabled={isSaving}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm cursor-pointer disabled:bg-slate-50 disabled:text-slate-500"
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
              onClick={onClose}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
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
  );
};

export default EditTaskPopup;
