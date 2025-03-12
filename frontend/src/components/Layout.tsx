import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { RootState } from '../store';

const Layout = () => {
  const { isDark } = useSelector((state: RootState) => state.theme);

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;