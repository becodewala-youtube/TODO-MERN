// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Calendar, AlertCircle } from 'lucide-react';
import { fetchTasks } from '../store/slices/taskSlice';  // Removed updateTask since it's unused
import { RootState, AppDispatch } from '../store'; // Import AppDispatch for correct typing
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null); // Explicitly typing as any or you can create a task type
  const dispatch = useDispatch<AppDispatch>(); // Correctly typing dispatch

  const { tasks = [], loading } = useSelector((state: RootState) => state.tasks);
  const { isDark } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    dispatch(fetchTasks());  // Dispatching correctly typed async action
  }, [dispatch]);

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: any) => {  // Typing the parameter explicitly (you could also use Task interface)
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          My Tasks
        </h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex items-center mb-4">
            <Calendar size={20} className="text-yellow-500 mr-2" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Due Today ({tasks.filter(task => new Date(task.dueDate).toDateString() === new Date().toDateString()).length})
            </h2>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="flex items-center mb-4">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              High Priority ({tasks.filter(task => task.priority === 'high').length})
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={() => openEditModal(task)} />
        ))}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={selectedTask} />
    </div>
  );
};

export default Dashboard;
