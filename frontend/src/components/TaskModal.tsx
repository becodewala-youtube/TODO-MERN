import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createTask, updateTask } from '../store/slices/taskSlice';
import { RootState } from '../store';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    _id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      priority,
      dueDate: new Date(dueDate),
    };

    if (task) {
      await dispatch(updateTask({ id: task._id, task: taskData }));
    } else {
      await dispatch(createTask(taskData));
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div
          className={`relative ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } rounded-lg w-full max-w-md p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 ">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-transparent"
              >
                <option value="low" className='dark:text-black'>Low</option>
                <option value="medium" className='dark:text-black'>Medium</option>
                <option value="high" className='dark:text-black'>High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;