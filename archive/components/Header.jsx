import React, { useState } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CreativeLanding</h1>
        <nav className="space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
          <a href="#hero">Home</a>
          <a href="#projects">Projects</a>
          <a href="#tools">Tools</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <BsSun /> : <BsMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;