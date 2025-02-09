import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100 transition-all duration-500">
        <Outlet />
      </div>

      {/* Right Sidebar */}
      <RightSidebar isOpen={isRightOpen} setIsOpen={setIsRightOpen} />
    </div>
  );
};

export default MainLayout;
