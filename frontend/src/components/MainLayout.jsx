import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  return (
    <div className="relative flex ">
      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 z-50">
        <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex justify-center items-center p-4 bg-gray-100 transition-all duration-500">
        <div className="w-full md:w-3/4 lg:w-1/2">
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="fixed top-0 right-0 z-50">
        <RightSidebar isOpen={isRightOpen} setIsOpen={setIsRightOpen} />
      </div>
    </div>
  );
};

export default MainLayout;
