import React from 'react';
import { Menu } from 'lucide-react';

const RightSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`h-screen bg-gradient-to-br from-green-500 to-green-900 shadow-lg p-4 flex flex-col transition-all duration-500 ${
        isOpen ? 'w-64' : 'w-0'
      } text-white`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 rounded-lg hover:bg-gray-200 transition self-end"
      >
        <Menu size={24} className="text-green-600" />
      </button>

      {/* Sidebar Content */}
      <div className="flex-grow mt-6">
        {isOpen ? (
          <p>Right Sidebar Content</p>
        ) : (
          <p className="text-xs text-center">RS</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
