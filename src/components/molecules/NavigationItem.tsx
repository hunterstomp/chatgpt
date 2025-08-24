import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationItemProps {
  to: string;
  label: string;
  icon: string;
  isActive: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ to, label, icon, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-soft'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default NavigationItem;
