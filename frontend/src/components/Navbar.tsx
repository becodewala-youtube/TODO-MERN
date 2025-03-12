
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';  // Import logout action
import { RootState } from '../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.auth);

  // Handle logout functionality
  const handleLogout = async () => {
    await dispatch(logout()); // Dispatch logout action
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className={`${
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    } shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            TaskMaster
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <>
                <Link
                  to="/profile"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
